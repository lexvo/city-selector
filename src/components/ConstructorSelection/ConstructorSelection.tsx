import React, { useState, useRef, useEffect } from 'react';
import { PinPathIcon, PlusIcon, ArrowUpIcon, SearchIcon } from '../../assets/icons';
import styles from './ConstructorSelection.module.css';

// --- Типы ---

/** Элемент списка (город или страна) */
export interface ListItem {
  id: string | number;
  name: string;
  category: 'city' | 'country';
  isFeatured?: boolean;
}

/** Свойства компонента */
export interface ConstructorSelectionProps {
  items: ListItem[];
  selectedItem: ListItem | null;
  onItemSelect: (item: ListItem) => void;
  title?: string;
  placeholder?: string;
  addButtonText?: string;
  collapseButtonText?: string;
  onButtonClick?: () => void;
  searchPlaceholder?: string;
  citiesTitle?: string;
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

  // Определяем состояние иконки
  const getIconState = () => {
    if (selectedItem) return 'selected'; // Зеленый
    if (isOpen) return 'open'; // Синий
    return 'default'; // Прозрачный
  };

  const wrapperClasses = [
    styles.wrapper,
    isOpen ? styles.open : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={wrapperClasses} ref={wrapperRef}>
      <div className={styles.header}>
        <div className={styles.leftSection}>
          {/* Иконка с фиксированным контейнером 52×52 */}
          <div className={`${styles.iconContainer} ${styles[getIconState()]}`}>
            <PinPathIcon className={styles.icon} />
          </div>

          <div className={styles.textContainer}>
            <div className={styles.title}>{title}</div>
            <div className={`${styles.description} ${!selectedItem ? styles.placeholder : ''}`}>
              {selectedItem ? selectedItem.name : placeholder}
            </div>
          </div>
        </div>

        <button 
          className={styles.actionButton}
          onClick={toggleDropdown}
          type="button"
        >
          <span className={styles.buttonContent}>
            <span className={styles.buttonText}>
              {isOpen ? collapseButtonText : addButtonText}
            </span>
            {isOpen ? (
              <ArrowUpIcon className={styles.buttonIcon} />
            ) : (
              <PlusIcon className={styles.buttonIcon} />
            )}
          </span>
        </button>
      </div>

      {isOpen && (
        <div className={styles.dropdown}>
          {/* Поле поиска с иконкой лупы справа */}
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

          <div className={styles.listContainer}>
            {groupedItems.cities && groupedItems.cities.length > 0 && (
              <>
                <div className={styles.sectionTitle}>{citiesTitle}</div>
                <div className={styles.gridList}>
                  {groupedItems.cities.map((item) => (
                    <div
                      key={item.id}
                      className={`${styles.listItem} ${
                        selectedItem?.id === item.id ? styles.selected : ''
                      } ${item.isFeatured ? styles.featured : ''}`}
                      onClick={() => handleSelect(item)}
                    >
                      {item.name}
                    </div>
                  ))}
                </div>
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

            {filteredItems.length === 0 && (
              <div className={styles.noResults}>Ничего не найдено</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};