import React, { useState } from 'react';
import './App.css';
import ImagePrimaryColor from 'image-primary-color';

const App: React.FC = () => {

  const [selectedImage, setSelectedImage] = useState<string | undefined>();
  const [colorList, setColorList] = useState<string[] | undefined>();

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {

    if(e.target.files == null)
    {
      return;
    }

    const files = e.target.files;

    if(files.length == 0) return;

    console.log(e.target.files);

    var reader = new FileReader();

    reader.onload = function (e) {
      setSelectedImage(e.target?.result as string);
    };

    reader.readAsDataURL(files[0]);



    ImagePrimaryColor(e.target.files[0]).then(
      (results) => setColorList(results)
    ).catch(
      (msg) => {
        console.log(msg);
      }
    );
  }

  return (
    <div className="App">
      <div>
        <input type="file" onChange={onSelectFile} />
        <div>
          <img src={selectedImage} style={{maxWidth: "300px"}} />
        </div>
        <div className='flex-box'>
          {colorList && colorList.map(
            (color) => {
              return (<div className='grid'><div className="color-box" style={{backgroundColor: `${color}`}}></div>HEX {color}</div>)
            }
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
