import { Component, useState } from 'react';
import { FiEdit3, FiTrash } from 'react-icons/fi';

import { Container } from './styles';
import api from '../../services/api';
import { IFoodPlate } from '../../types/Food';

interface FoodProps {
  food: IFoodPlate;
  handleDelete: (id: number) => void;
  handleEditFood: (food: IFoodPlate) => void;
}

function Food({ food, handleDelete, handleEditFood }: FoodProps) {
  const [isAvailable, setIsAvailable] = useState(food.available);
  

  async function toggleAvailable() {
    const updatedFood = {
      ...food,
      available: !isAvailable,
    };

    const response = await api.put(`/foods/${food.id}`, updatedFood);

    setIsAvailable(response.data.available);
  }

  function setEditingFood() {
    handleEditFood(food);
  }


  return (
    <Container available={isAvailable}>
      <header>
        <img src={food.image} alt={food.name} />
      </header>
      <section className="body">
        <h2>{food.name}</h2>
        <p>{food.description}</p>
        <p className="price">
          R$ <b>{food.price}</b>
        </p>
      </section>
      <section className="footer">
        <div className="icon-container">
          <button
            type="button"
            className="icon"
            onClick={setEditingFood}
            data-testid={`edit-food-${food.id}`}
          >
            <FiEdit3 size={20} />
          </button>
          <button 
            type="button"
            className="icon"
            onClick={() => handleDelete(food.id)}
            data-testid={`remove-food-${food.id}`}
          >
            <FiTrash size={20} />
          </button>
        </div>
        <div className="availability-container">
          <p>{isAvailable ? 'Disponível' : 'Indisponível'}</p>
          
          <label htmlFor={`available-switch-${food.id}`} className="switch">
            <input
              id={`available-switch-${food.id}`}
              type="checkbox"
              checked={isAvailable}
              onChange={toggleAvailable}
              data-testid={`available-switch-${food.id}`}
            />
            <span className="slider" />
          </label>
        </div>
      </section>

    </Container>
  )
         
 }

export default Food;
