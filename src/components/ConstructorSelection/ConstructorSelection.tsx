import React, { useState, useRef, useEffect } from 'react';
import { PlusIcon, ArrowUpIcon, SearchIcon, CheckMarkIcon, ExclamationIcon } from '../../assets/icons';
import styles from './ConstructorSelection.module.css';

// --- Типы ---

export interface ListItem {
  id: string | number;
  name: string;
  category: 'city' | 'country';
  isFeatured?: boolean;
}

export interface ConstructorSelectionProps {
  /** Иконка для отображения слева */
  icon: React.ReactNode;
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
  /** Текст кнопки "Готово" */
  doneButtonText?: string;
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
  icon,
  items,
  selectedItem,
  onItemSelect,
  title = 'Откуда едем?',
  placeholder = 'Например "Москва"',
  addButtonText = 'Добавить',
  collapseButtonText = 'Свернуть',
  doneButtonText = 'Готово',
  onButtonClick,
  searchPlaceholder = 'Начните вводить название, а мы подскажем',
  citiesTitle = 'Города России',
  countriesTitle = 'Другие страны',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);

  const wrapperRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (onButtonClick) {
      onButtonClick();
    }
  };

  const handleSelect = (item: ListItem) => {
    onItemSelect(item);
    setSearchTerm('');
    setIsOpen(false);
  };

  const groupedItems = filteredItems.reduce<Record<string, ListItem[]>>((acc, item) => {
    const key = item.category === 'city' ? 'cities' : 'countries';
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  // --- Определяем состояние ---
  const hasSelectedItem = !!selectedItem;
  const iconState = hasSelectedItem ? 'selected' : isOpen ? 'open' : 'default';
  const hasNoResults = isOpen && filteredItems.length === 0 && searchTerm.trim().length > 0;

  const wrapperClasses = [
    styles.wrapper,
    isOpen ? styles.open : '',
    hasSelectedItem ? styles.hasValue : '',
    hasNoResults ? styles.noResults : '',
  ].filter(Boolean).join(' ');

  // --- Определяем текст и иконку кнопки ---
  let buttonText = addButtonText;
  let ButtonIcon = PlusIcon;

  if (hasSelectedItem) {
    buttonText = doneButtonText;
    ButtonIcon = CheckMarkIcon;
  } else if (isOpen && !hasNoResults) {
    buttonText = collapseButtonText;
    ButtonIcon = ArrowUpIcon;
  } else {
    buttonText = addButtonText;
    ButtonIcon = PlusIcon;
  }

  // Разделяем города на выделенные и остальные
  const featuredCities = groupedItems.cities?.filter(item => item.isFeatured) || [];
  const regularCities = groupedItems.cities?.filter(item => !item.isFeatured) || [];

  // Разбиваем обычные города на колонки для отображения сверху вниз
  const chunkSize = Math.ceil(regularCities.length / 3);
  const columns = [];
  for (let i = 0; i < regularCities.length; i += chunkSize) {
    columns.push(regularCities.slice(i, i + chunkSize));
  }

  return (
    <div className={wrapperClasses} ref={wrapperRef}>
      <div className={styles.header}>
        <div className={styles.leftSection}>
          <div className={`${styles.iconContainer} ${styles[iconState]}`}>
            {icon}
          </div>

          <div className={styles.textContainer}>
            <div className={styles.title}>{title}</div>
            <div className={`${styles.description} ${!selectedItem ? styles.placeholder : ''}`}>
              {selectedItem ? selectedItem.name : placeholder}
            </div>
          </div>
        </div>

        <button 
          className={`${styles.actionButton} ${hasSelectedItem ? styles.actionButtonDone : ''}`}
          onClick={toggleDropdown}
          type="button"
        >
          <span className={styles.buttonContent}>
            <span className={styles.buttonText}>{buttonText}</span>
            <ButtonIcon className={styles.buttonIcon} />
          </span>
        </button>
      </div>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.searchContainer}>
            <input
              type="text"
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={searchPlaceholder}
              autoFocus
            />
            <SearchIcon className={styles.searchIcon} />
          </div>

          {hasNoResults ? (
            <div className={styles.emptyState}>
              <ExclamationIcon className={styles.emptyIcon} />
              <div className={styles.emptyTitle}>Город не найден</div>
              <div className={styles.emptyDescription}>
                Проверьте написание – или выберите город из списка.
              </div>
            </div>
          ) : (
            <div className={styles.listContainer}>
              {(featuredCities.length > 0 || regularCities.length > 0) && (
                <>
                  <div className={styles.sectionTitle}>{citiesTitle}</div>
                  
                  {featuredCities.length > 0 && (
                    <div className={styles.featuredGrid}>
                      {featuredCities.map((item) => (
                        <div
                          key={item.id}
                          className={`${styles.listItem} ${styles.featured} ${
                            selectedItem?.id === item.id ? styles.selected : ''
                          }`}
                          onClick={() => handleSelect(item)}
                        >
                          {item.name}
                        </div>
                      ))}
                    </div>
                  )}

                  {regularCities.length > 0 && (
                    <div className={styles.regularGrid}>
                      {columns.map((column, colIndex) => (
                        <div key={colIndex} className={styles.column}>
                          {column.map((item) => (
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
                      ))}
                    </div>
                  )}
                </>
              )}

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

              {filteredItems.length === 0 && searchTerm.trim().length === 0 && (
                <div className={styles.noResults}>Начните вводить название</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};