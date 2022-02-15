import Reader from 'jsmediatags/build2/BlobFileReader';

function isRangeValid(range: any, fileSize: any) {
  var invalidPositiveRange = range.offset >= 0 && range.offset + range.length >= fileSize;
  var invalidNegativeRange = range.offset < 0 && (-range.offset > fileSize || range.offset + range.length > 0);
  return !(invalidPositiveRange || invalidNegativeRange);
}
class TagReader {

function findTag(fileReader: any) {
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
        } catch (ex) {
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
}
