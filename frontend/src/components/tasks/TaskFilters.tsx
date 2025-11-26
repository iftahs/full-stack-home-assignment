import React, { useState, useEffect } from 'react';
import { TextInput } from '../dsm/TextInput';
import { Select } from '../dsm/Select';
import { Button } from '../dsm/Button';
import { TaskFilters as FilterType } from '../../types';
import { ChevronDownIcon } from '../../assets/icons/ChevronDownIcon';
import { useDebounce } from '../../hooks/useDebounce';

interface TaskFiltersProps {
  filters: FilterType;
  onFilterChange: (filters: FilterType) => void;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({ filters, onFilterChange }) => {
  const [localFilters, setLocalFilters] = useState<FilterType>(filters);
  const [presetName, setPresetName] = useState('');
  const [presets, setPresets] = useState<{ name: string; filters: FilterType }[]>([]);
  
  const debouncedSearch = useDebounce(localFilters.search, 300);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  useEffect(() => {
    // Only trigger update if the debounced search value is different from the current prop value
    // This prevents loops and unnecessary updates when props change
    if (debouncedSearch !== filters.search) {
      onFilterChange({ ...localFilters, search: debouncedSearch });
    }
  }, [debouncedSearch]);

  useEffect(() => {
    const savedPresets = localStorage.getItem('taskFilterPresets');
    if (savedPresets) {
      setPresets(JSON.parse(savedPresets));
    }
  }, []);

  const handleChange = (key: keyof FilterType, value: string) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    
    // For non-search fields, update immediately
    if (key !== 'search') {
      onFilterChange(newFilters);
    }
  };

  const handleSavePreset = () => {
    if (!presetName) return;
    const newPresets = [...presets, { name: presetName, filters: localFilters }];
    setPresets(newPresets);
    localStorage.setItem('taskFilterPresets', JSON.stringify(newPresets));
    setPresetName('');
  };



  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-6 transition-colors duration-200">
      <div 
        className="p-4 flex justify-between items-center cursor-pointer border-b dark:border-gray-700"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h2>
          {(localFilters.search || localFilters.status || localFilters.priority) && (
            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full dark:bg-blue-900 dark:text-blue-200">
              Active
            </span>
          )}
        </div>
        <button 
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <ChevronDownIcon 
            className={`w-6 h-6 transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
          />
        </button>
      </div>

      <div 
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden">
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <TextInput
                label="Search"
                value={localFilters.search || ''}
                onChange={(e) => handleChange('search', e.target.value)}
                placeholder="Search tasks..."
              />
              
              <Select
                label="Status"
                value={localFilters.status || ''}
                onChange={(value) => handleChange('status', value)}
                options={[
                  { value: '', label: 'All Statuses' },
                  { value: 'TODO', label: 'To Do' },
                  { value: 'IN_PROGRESS', label: 'In Progress' },
                  { value: 'DONE', label: 'Done' },
                ]}
              />

              <Select
                label="Priority"
                value={localFilters.priority || ''}
                onChange={(value) => handleChange('priority', value)}
                options={[
                  { value: '', label: 'All Priorities' },
                  { value: 'LOW', label: 'Low' },
                  { value: 'MEDIUM', label: 'Medium' },
                  { value: 'HIGH', label: 'High' },
                ]}
              />

              <div className="flex gap-2">
                 <div className="flex-1">
                   <Select
                     label="Presets"
                     value=""
                     onChange={(value) => {
                       const preset = presets.find(p => p.name === value);
                       if (preset) {
                         setLocalFilters(preset.filters);
                         onFilterChange(preset.filters);
                       }
                     }}
                     options={presets.map(p => ({ label: p.name, value: p.name }))}
                     placeholder="Load Preset"
                   />
                 </div>
              </div>
            </div>
            
            <div className="mt-4 flex flex-col md:flex-row gap-2 items-stretch md:items-end border-t pt-4 dark:border-gray-700">
                <div className="flex-1 w-full md:max-w-xs">
                  <TextInput
                      label="Save Current Filters"
                      value={presetName}
                      onChange={(e) => setPresetName(e.target.value)}
                      placeholder="Preset Name"
                  />
                </div>
                <Button onClick={handleSavePreset} variant="primary" disabled={!presetName}>
                  Save Preset
                </Button>
                <Button onClick={() => {
                    const empty = { search: '', status: '', priority: '' };
                    setLocalFilters(empty);
                    onFilterChange(empty);
                }} variant="secondary">
                  Clear Filters
                </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
