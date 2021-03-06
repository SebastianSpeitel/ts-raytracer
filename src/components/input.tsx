import React from 'react';

export interface InputProps {
  label: string;
  size: number;
  value: number;
  min?: number;
  max?: number;
  onValueChange: (value: number) => void;
}

const NumberInput = (props: InputProps): React.ReactElement => {
  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const value = parseInt(event.target.value);
    if (!Number.isNaN(value)) {
      props.onValueChange(value);
    }
  };

  return (
    <div className="input">
      <span>{props.label}</span>
      <input
        type="number"
        size={props.size}
        min={props.min}
        max={props.max}
        value={props.value}
        onChange={onInputChange}></input>
    </div>
  );
};

export default NumberInput;
