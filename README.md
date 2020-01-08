## About

This is a simple library which grabs the common colors from an image. I use this in my own project to theme my site around a users custom logo upload.

## Usage

Simply pass a `file blob` to `ImageCommonColor`

```js
import ImageCommonColor from 'image-common-color';
...
ImageCommonColor(fileBlob).then(
    (list) => console.log(list)
);
```

Check the example for a quick demonstration using React.