import './App.css';
import { useEffect, useState } from 'react';

const DragndropForm = () => {
  const [drag, setDrag] = useState(false);
  const [images, setImages] = useState([]);
  const [textInput, setTextInput] = useState('');
  const [checkboxList, setCheckboxList] = useState([]);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
  const [generatedText, setGeneratedText] = useState('');

  function handleCheckboxChange(e) {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedCheckboxes(prevState => [...prevState, value]);
    } else {
      setSelectedCheckboxes(prevState => prevState.filter(item => item !== value));
    }
  }

  function dragStartHandler(e) {
    e.preventDefault();
    setDrag(true);
  }

  function dragLeaveHandler(e) {
    e.preventDefault();
    setDrag(false);
  }

  function onDropHandler(e) {
    e.preventDefault();
    let files = [...e.dataTransfer.files];
    setDrag(false);
    const images = files.map(file => URL.createObjectURL(file));
    setImages(prevImages => [...prevImages, ...images]);
  }

  function handleTextChange(e) {
      setTextInput(e.target.value);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append('files', images);
    formData.append('text', textInput);

    const res = await fetch('/load', {
      method: 'POST',
      body: formData
    });

    const data = await res.json();
    setCheckboxList(data);
  }

  async function handleCheckboxSubmit(e) {
    if (!selectedCheckboxes.length) return;
    
    const res = await fetch('/checkboxes', {
      method: 'POST',
      header: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tags: selectedCheckboxes })
    })

    const text = await res.text();
    setGeneratedText(text);
  }

  useEffect(() => {
    handleCheckboxSubmit();
  }, [selectedCheckboxes]);

  return (
    <div>
      {drag 
        ? <div 
        onDragStart={e => dragStartHandler(e)}
        onDragLeave={e => dragLeaveHandler(e)}
        onDragOver={e => dragStartHandler(e)}
        onDrop={e => onDropHandler(e)}
        className='drop-area'>Перетащите файлы сюда</div>
        : <div
            onDragStart={e => dragStartHandler(e)}
            onDragLeave={e => dragLeaveHandler(e)}
            onDragOver={e => dragStartHandler(e)}
          >
            Отпустите, чтобы загрузить
          </div>}
      {images && images.map((image, index) => (
        <img 
          className='loaded-image'
          key={index} 
          src={image} 
          alt={`Изображение ${index + 1}`} />
      ))}
      <form onSubmit={handleSubmit}>
        <textarea value={textInput} onChange={handleTextChange} />
        <button type='submit'>Загрузить</button>
      </form>
      <form onSubmit={handleCheckboxSubmit}>
          {checkboxList.map((item, index) => (
          <div key={index}>
            <label>
              <input
                type="checkbox"
                value={item}
                checked={selectedCheckboxes.includes(item)}
                onChange={handleCheckboxChange}
              />
              {item}
            </label>
          </div>
        ))}
      </form>
      <p>{generatedText}</p>
    </div>
  )
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <DragndropForm />
      </header>
    </div>
  );
}

export default App;
