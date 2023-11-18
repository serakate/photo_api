import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createServer, Model } from 'miragejs';

// Определяем модель для загруженных файлов
const UploadedFile = Model.extend({});

const runServer = false
// Создаем сервер Mirage
if (runServer) {
createServer({
  models: {
    uploadedFile: UploadedFile,
  },

  routes() {
    this.namespace = ''; // Отключаем префикс для маршрутов

    this.post('/load', (schema, request) => {
      // const { files } = JSON.parse(request.requestBody).data;

      // // Обрабатываем каждый файл
      // const results = files.map(file => {
      //   // Делаем что-то с файлом (например, сохраняем его в базе данных)
      //   // В данном примере мы просто возвращаем имя файла в верхнем регистре
      //   const result = file.toUpperCase();
      //   return result;
      // });

      // return { results };
      return ['кладбище', 'закладки', 'парк'];
    });

    this.post('/checkboxes', (schema, request) => {
      return 'Какой-то сгенерированный текст с тегами: ';
    })
  },
});
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
