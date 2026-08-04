import React, { useState, useRef, useEffect } from 'react';
import { PathIcon, PinIcon } from '../../assets/icons';
import styles from './ConstructorSelection.module.css';

// --- Типы ---

/** Элемент списка (город или страна) */
export interface ListItem {
  id: string | number;
  name: string;
  category: 'city' | 'country';
}

/** Свойства компонента */
export interface ConstructorSelectionProps {
  /** Список элементов для выбора */
  items: ListItem[];
  /** Выбранный элемент */
  selectedItem: ListItem | null;
  /** Callback при выборе */
  onItemSelect: (item: ListItem) => void;
  /** Заголовок (например, "Откуда едем?") */
  title?: string;
  /** Текст-заполнитель, когда ничего не выбрано */
  placeholder?: string;
  /** Текст кнопки "Добавить" */
  addButtonText?: string;
  /** Текст кнопки "Свернуть" */
  collapseButtonText?: string;
  /** Callback при клике на кнопку (опционально) */
  onButtonClick?: () => void;
  /** Плейсхолдер для поиска */
  searchPlaceholder?: string;
  /** Заголовок секции "Города России" */
  citiesTitle?: string;
  /** Заголовок секции "Другие страны" */
  countriesTitle?: string;
}

// --- Компонент ---

export const ConstructorSelection: React.FC<ConstructorSelectionProps> = ({
  items,
  selectedItem,
  onItemSelect,
  title = 'Откуда едем?',
  placeholder = 'Например "Москва"',
  addButtonText = 'Добавить',
  collapseButtonText = 'Свернуть',
  onButtonClick,
  searchPlaceholder = 'Начните вводить название, а мы подскажем',
  citiesTitle = 'Города России',
  countriesTitle = 'Другие страны',
}) => {
  // Состояния
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);

  // Refs
  const wrapperRef = useRef<HTMLDivElement>(null);

  // --- Эффекты ---

  /** Фильтрация элементов при поиске */
  useEffect(() => {
    const lowercasedTerm = searchTerm.toLowerCase().trim();
    if (lowercasedTerm === '') {
      setFilteredItems(items);
    } else {
      const filtered = items.filter(item =>
        item.name.toLowerCase().includes(lowercasedTerm)
      );
      setFilteredItems(filtered);
    }
  }, [searchTerm, items]);

  /** Закрытие при клике вне компонента */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // --- Обработчики ---

  /** Переключение состояния (открыть/закрыть) */
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (onButtonClick) {
      onButtonClick();
    }
  };

  /** Выбор элемента */
  const handleSelect = (item: ListItem) => {
    onItemSelect(item);
    setSearchTerm('');
    setIsOpen(false); // Закрываем список после выбора
  };

  /** Группировка элементов по категориям */
  const groupedItems = filteredItems.reduce<Record<string, ListItem[]>>((acc, item) => {
    const key = item.category === 'city' ? 'cities' : 'countries';
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  // --- Рендер ---

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      {/* Заголовочная часть */}
      <div className={styles.header}>
        {/* Левая часть: иконка + текст */}
        <div className={styles.leftSection}>
          {/* Иконка из двух SVG */}
          <div className={styles.iconContainer}>
            <div className={styles.iconWrapper}>
              <PathIcon className={styles.pathIcon} />
              <PinIcon className={styles.pinIcon} />
            </div>
          </div>

          {/* Текстовый блок */}
          <div className={styles.textContainer}>
            <div className={styles.title}>{title}</div>
            <div className={`${styles.description} ${!selectedItem ? styles.placeholder : ''}`}>
              {selectedItem ? selectedItem.name : placeholder}
            </div>
          </div>
        </div>

        {/* Правая часть: кнопка (меняется в зависимости от состояния) */}
        <button 
          className={styles.actionButton}
          onClick={toggleDropdown}
          type="button"
        >
          {isOpen ? collapseButtonText : addButtonText}
        </button>
      </div>

      {/* Выпадающий список (отображается при isOpen) */}
      {isOpen && (
        <div className={styles.dropdown}>
          {/* Поле поиска */}
          <div className={styles.searchContainer}>
            <input
              type="text"
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={searchPlaceholder}
              autoFocus
            />
            {searchTerm && (
              <button 
                className={styles.clearButton} 
                onClick={() => setSearchTerm('')}
                type="button"
              >
                ✕
              </button>
            )}
          </div>

          {/* Список элементов */}
          <div className={styles.listContainer}>
            {/* Города России */}
            {groupedItems.cities && groupedItems.cities.length > 0 && (
              <>
                <div className={styles.sectionTitle}>{citiesTitle}</div>
                <div className={styles.gridList}>
                  {groupedItems.cities.map((item) => (
                    <div
                      key={item.id}
                      className={`${styles.listItem} ${
                        selectedItem?.id === item.id ? styles.selected : ''
                      }`}
                      onClick={() => handleSelect(item)}
                    >
                      {item.name}
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Другие страны */}
            {groupedItems.countries && groupedItems.countries.length > 0 && (
              <>
                <div className={styles.sectionTitle}>{countriesTitle}</div>
                <div className={styles.gridList}>
                  {groupedItems.countries.map((item) => (
                    <div
                      key={item.id}
                      className={`${styles.listItem} ${
                        selectedItem?.id === item.id ? styles.selected : ''
                      }`}
                      onClick={() => handleSelect(item)}
                    >
                      {item.name}
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Если ничего не найдено */}
            {filteredItems.length === 0 && (
              <div className={styles.noResults}>Ничего не найдено</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};