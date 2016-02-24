$.fn.upload = function (url, bearer, fnData, max) {

    var self = this;

    if (self.data('a') === 1)
        return;

    if (typeof(fnData) === 'number') {
        var tmp = max;
        max = fnData;
        fnData = tmp;
    }

    self.data('a', 1);
    self.bind('change', function(e) {

        if (self.data('b') === 1)
            return;

        var files = this.files;
        var fd = new FormData();

        if (max > 0 && files.length > max) {
            self.trigger('upload-error', new Error('Maximum files exceeded.'), 0);
            return;
        }

        for (var i = 0; i < files.length; i++){
            if (i === 0)
                fd.append('file', files[i])
            else
                fd.append('file' + (i + 1), files[i]);
        }


        if (typeof(fnData) === 'function')
            fnData.call(self, fd);

        var xhr = new XMLHttpRequest();

        xhr.addEventListener('load', function () {
            self.data('b', 0);

            if (this.status === 200) {
                self.trigger('upload-end', [true, $.parseJSON(this.responseText)]);
                return;
            }

            self.trigger('upload-error', new Error(this.responseText), this.status);
            self.trigger('upload-end', [false, null]);
        }, false);

        xhr.upload.addEventListener('upload-progress', function (evt) {
            var percentage = 0;
            if (evt.lengthComputable)
                percentage = Math.round(evt.loaded * 100 / evt.total);
            self.trigger('upload-progress', [percentage, evt.transferSpeed, evt.timeRemaining]);
        }, false);

        xhr.addEventListener('error', function (e) {
            self.data('b', 0);
            self.trigger('upload-error', e);
            self.trigger('upload-end', [false, null]);
        }, false);

        xhr.addEventListener('abort', function () {
            self.data('b', 0);
            self.trigger('upload-end', [false, null]);
        }, false);

        self.data('b', 1);
        self.trigger('upload-begin');

        xhr.open('POST', url);
        //set header
        xhr.setRequestHeader("Authorization", "Bearer " + bearer);
        xhr.send(fd);
    });

    return true;
};

$.fn.dragdrop = function (url, cls, fnData, max) {

    var self = $(this);

    if (self.data('a') === 1)
        return self;

    if (typeof(cls) === 'number') {
        var tmp = max;
        max = cls;
        cls = tmp;
    }

    if (typeof(cls) === 'function') {
        var tmp = fnData;
        fnData = cls;
        cls = tmp;
    }

    if (typeof(fnData) === 'number') {
        max = fnData;
        fnData = null;
    }

    self.data('a', 1);

    self.bind('dragenter dragover dragexit drop dragleave', function(e) {

        var el = $(this);
        var selected = e.type === 'dragenter';

        if (e.type !== 'dragover' && typeof(cls) === 'string')
            el.toggleClass(cls, selected);

        switch (e.type) {
            case 'drop':
                e.stopPropagation();
                e.preventDefault();
                break;
            case 'dragenter':
            case 'dragover':
            case 'dragexit':
            case 'dragleave':
            default:
                e.stopPropagation();
                e.preventDefault();
                return;
        }

        $('input:focus,textarea:focus').blur();

        var files = e.originalEvent.dataTransfer.files;
        var count = files.length;
        if (count === 0)
            return;

        if (max > 0 && files.length > max) {
            self.trigger('upload-error', new Error('Maximum files exceeded.'), 0);
            return;
        }

        if (self.data('b') === 1)
            return;

        var fd = new FormData();

        for (var i = 0; i < files.length; i++)
            fd.append('file' + (i + 1), files[i]);

        if (typeof(fnData) === 'function')
            fnData.call(self, fd);

        var xhr = new XMLHttpRequest();

        xhr.addEventListener('load', function () {
            self.data('b', 0);

            if (this.status === 200) {
                self.trigger('upload-end', [true, $.parseJSON(this.responseText)]);
                return;
            }

            self.trigger('upload-error', new Error(this.responseText), this.status);
            self.trigger('upload-end', [false, null]);

        }, false);

        xhr.upload.addEventListener('upload-progress', function (evt) {
            var percentage = 0;
            if (evt.lengthComputable)
                percentage = Math.round(evt.loaded * 100 / evt.total);
            self.trigger('upload-progress', [percentage, evt.transferSpeed, evt.timeRemaining]);
        }, false);

        xhr.addEventListener('error', function (e) {
            self.data('b', 0);
            self.trigger('upload-error', e);
            self.trigger('upload-end', [false, null]);
        }, false);

        xhr.addEventListener('abort', function () {
            self.data('b', 0);
            self.trigger('upload-end', [false, null]);
        }, false);

        self.data('b', 1);
        self.trigger('upload-begin');

        xhr.open('POST', url);
        xhr.send(fd);
    });

    return self;
};
