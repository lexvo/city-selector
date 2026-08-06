import { useState } from 'react';
import { ConstructorSelection } from './components/ConstructorSelection';
import type { ListItem } from './components/ConstructorSelection';
import './App.css';

// Данные из макета с правильным порядком
const items: ListItem[] = [
  // Выделенные города (Москва и СПб) - первыми
  { id: 1, name: 'Москва', category: 'city', isFeatured: true },
  { id: 2, name: 'Санкт-Петербург', category: 'city', isFeatured: true },
  // Остальные города - в алфавитном порядке, начиная со второй строки
  { id: 3, name: 'Барнаул', category: 'city' },
  { id: 4, name: 'Владивосток', category: 'city' },
  { id: 5, name: 'Волгоград', category: 'city' },
  { id: 6, name: 'Воронеж', category: 'city' },
  { id: 7, name: 'Екатеринбург', category: 'city' },
  { id: 8, name: 'Ижевск', category: 'city' },
  { id: 9, name: 'Казань', category: 'city' },
  { id: 10, name: 'Краснодар', category: 'city' },
  { id: 11, name: 'Красноярск', category: 'city' },
  { id: 12, name: 'Нижний Новгород', category: 'city' },
  { id: 13, name: 'Новосибирск', category: 'city' },
  { id: 14, name: 'Омск', category: 'city' },
  { id: 15, name: 'Пермь', category: 'city' },
  { id: 16, name: 'Ростов-на-Дону', category: 'city' },
  { id: 17, name: 'Самара', category: 'city' },
  { id: 18, name: 'Саратов', category: 'city' },
  { id: 19, name: 'Тольятти', category: 'city' },
  { id: 20, name: 'Ульяновск', category: 'city' },
  { id: 21, name: 'Уфа', category: 'city' },
  { id: 22, name: 'Челябинск', category: 'city' },
  { id: 23, name: 'Ярославль', category: 'city' },
  // Другие страны
  { id: 24, name: 'Азербайджан', category: 'country' },
  { id: 25, name: 'Армения', category: 'country' },
  { id: 26, name: 'Беларусь', category: 'country' },
  { id: 27, name: 'Грузия', category: 'country' },
  { id: 28, name: 'Казахстан', category: 'country' },
  { id: 29, name: 'Кыргызстан', category: 'country' },
  { id: 30, name: 'Молдова', category: 'country' },
  { id: 31, name: 'Таджикистан', category: 'country' },
  { id: 32, name: 'Узбекистан', category: 'country' },
];

function App() {
  const [selectedItem, setSelectedItem] = useState<ListItem | null>(null);

  const handleButtonClick = () => {
    console.log('Кнопка нажата');
  };

  return (
    <div className="app">
      <ConstructorSelection
        items={items}
        selectedItem={selectedItem}
        onItemSelect={setSelectedItem}
        title="Откуда едем?"
        placeholder='Например "Москва"'
        addButtonText="Добавить"
        collapseButtonText="Свернуть"
        doneButtonText="Готово"
        onButtonClick={handleButtonClick}
        searchPlaceholder="Начните вводить название, а мы подскажем"
        citiesTitle="Города России"
        countriesTitle="Другие страны"
      />
    </div>
  );
}

export default App;