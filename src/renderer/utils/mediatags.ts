'use strict';
import XhrFileReader from 'jsmediatags/build2/XhrFileReader';
import BlobFileReader from 'jsmediatags/build2/BlobFileReader';
import ArrayFileReader from 'jsmediatags/build2/ArrayFileReader';
import ID3v1TagReader from 'jsmediatags/build2/ID3v1TagReader';
import ID3v2TagReader from 'jsmediatags/build2/ID3v2TagReader';
import MP4TagReader from 'jsmediatags/build2/MP4TagReader';
import FLACTagReader from 'jsmediatags/build2/FLACTagReader';
import type { Tags } from 'jsmediatags/types';

interface Callbacks {
  onSuccess: (tags: any) => void;
  onError: (error: any) => void;
}
type FileReader =
  | typeof XhrFileReader
  | typeof BlobFileReader
  | typeof ArrayFileReader;
type FileReaderType = XhrFileReader | BlobFileReader | ArrayFileReader;

const mediaFileReaders = [XhrFileReader, BlobFileReader, ArrayFileReader];
const mediaTagReaders = [
  ID3v2TagReader,
  ID3v1TagReader,
  MP4TagReader,
  FLACTagReader,
];

export default async function (location: File): Promise<Tags | null> {
  return new Promise((resolve) => {
    new Reader(location).read({
      onSuccess: (result: any) => {
        resolve(result.tags || result);
      },
      onError: (error: any) => {
        console.error(error);
        resolve(null);
      },
    });
  });
}

function isRangeValid(range: any, fileSize: number) {
  var invalidPositiveRange =
    range.offset >= 0 && range.offset + range.length >= fileSize;
  var invalidNegativeRange =
    range.offset < 0 &&
    (-range.offset > fileSize || range.offset + range.length > 0);
  return !(invalidPositiveRange || invalidNegativeRange);
}

class Reader {
  public file: File;
  public tagsToRead?: string[];
  public fileReader?: FileReader;
  public tagReader: any;

  constructor(file: File) {
    this.file = file;
  }

  public setTagsToRead(tagsToRead?: string[]) {
    this.tagsToRead = tagsToRead;
    return this;
  }

  public setFileReader(fileReader: any) {
    this.fileReader = fileReader;
    return this;
  }

  public setTagReader(tagReader: any) {
    this.tagReader = tagReader;
    return this;
  }

  public read(callbacks: { onSuccess: any; onError: any }) {
    var FileReader = this._getFileReader();

    var fileReader = new FileReader(this.file as any);
    var self = this;
    fileReader.init({
      onSuccess: function onSuccess() {
        self._getTagReader(fileReader, {
          onSuccess: function onSuccess(TagReader: any) {
            new TagReader(fileReader)
              .setTagsToRead(self.tagsToRead)
              .read(callbacks);
          },
          onError: callbacks.onError,
        });
      },
      onError: callbacks.onError,
    });
  }
  private _getFileReader() {
    if (this.fileReader) {
      return this.fileReader;
    } else {
      return this._findFileReader();
    }
  }

  private _findFileReader() {
    for (var i = 0; i < mediaFileReaders.length; i++) {
      if (mediaFileReaders[i].canReadFile(this.file)) {
        return mediaFileReaders[i];
      }
    }

    throw new Error('No suitable file reader found for ' + this.file);
  }

  private _getTagReader(fileReader: FileReaderType, callbacks: Callbacks) {
    if (this.tagReader) {
      var tagReader = this.tagReader;
      setTimeout(function () {
        callbacks.onSuccess(tagReader);
      }, 1);
    } else {
      this._findTagReader(fileReader, callbacks);
    }
  }

  private _findTagReader(fileReader: FileReaderType, callbacks: Callbacks) {
    // We don't want to make multiple fetches per tag reader to get the tag
    // identifier. The strategy here is to combine all the tag identifier
    // ranges into one and make a single fetch. This is particularly important
    // in file readers that have expensive loads like the XHR one.
    // However, with this strategy we run into the problem of loading the
    // entire file because tag identifiers might be at the start or end of
    // the file.
    // To get around this we divide the tag readers into two categories, the
    // ones that read their tag identifiers from the start of the file and the
    // ones that read from the end of the file.
    var tagReadersAtFileStart = [];
    var tagReadersAtFileEnd = [];
    var fileSize = fileReader.getSize();

    for (var i = 0; i < mediaTagReaders.length; i++) {
      var range = mediaTagReaders[i].getTagIdentifierByteRange();

      if (!isRangeValid(range, fileSize)) {
        continue;
      }

      if (
        (range.offset >= 0 && range.offset < fileSize / 2) ||
        (range.offset < 0 && range.offset < -fileSize / 2)
      ) {
        tagReadersAtFileStart.push(mediaTagReaders[i]);
      } else {
        tagReadersAtFileEnd.push(mediaTagReaders[i]);
      }
    }

    var tagsLoaded = false;
    var loadTagIdentifiersCallbacks = {
      onSuccess: function onSuccess() {
        if (!tagsLoaded) {
          // We're expecting to load two sets of tag identifiers. This flag
          // indicates when the first one has been loaded.
          tagsLoaded = true;
          return;
        }

        for (var i = 0; i < mediaTagReaders.length; i++) {
          var range = mediaTagReaders[i].getTagIdentifierByteRange();

          if (!isRangeValid(range, fileSize)) {
            continue;
          }

          try {
            var tagIndentifier = fileReader.getBytesAt(
              range.offset >= 0 ? range.offset : range.offset + fileSize,
              range.length
            );
          } catch (ex: any) {
            if (callbacks.onError) {
              callbacks.onError({
                type: 'fileReader',
                info: ex.message,
              });
            }

            return;
          }

          if (mediaTagReaders[i].canReadTagFormat(tagIndentifier)) {
            callbacks.onSuccess(mediaTagReaders[i]);
            return;
          }
        }

        if (callbacks.onError) {
          callbacks.onError({
            type: 'tagFormat',
            info: 'No suitable tag reader found',
          });
        }
      },
      onError: callbacks.onError,
    };

    this._loadTagIdentifierRanges(
      fileReader,
      tagReadersAtFileStart,
      loadTagIdentifiersCallbacks
    );

    this._loadTagIdentifierRanges(
      fileReader,
      tagReadersAtFileEnd,
      loadTagIdentifiersCallbacks
    );
  }

  private _loadTagIdentifierRanges(
    fileReader: FileReaderType,
    tagReaders: any[],
    callbacks: any
  ) {
    if (tagReaders.length === 0) {
      // Force async
      setTimeout(callbacks.onSuccess, 1);
      return;
    }
    const tagIdentifierRange: [number, number] = [Number.MAX_VALUE, 0];
    const fileSize = fileReader.getSize(); // Create a super set of all ranges so we can load them all at once.
    // Might need to rethink this approach if there are tag ranges too far
    // a part from each other. We're good for now though.

    for (var i = 0; i < tagReaders.length; i++) {
      const range = tagReaders[i].getTagIdentifierByteRange();
      const start = range.offset >= 0 ? range.offset : range.offset + fileSize;
      const end = start + range.length - 1;
      tagIdentifierRange[0] = Math.min(start, tagIdentifierRange[0]);
      tagIdentifierRange[1] = Math.max(end, tagIdentifierRange[1]);
    }

    fileReader.loadRange(tagIdentifierRange, callbacks);
  }
}
