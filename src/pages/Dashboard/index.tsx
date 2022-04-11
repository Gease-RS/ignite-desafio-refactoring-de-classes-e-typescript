import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';
import { AddFood, IFoodPlate } from '../../types/Food';

interface IFood {
    name: string;
    image: string;
    price: string;
    description: string;
}

const Dashboard = () => {
  const [foods, setFoods] = useState<IFoodPlate[]>([]);
  const [editingFood, setEditingFood] = useState<IFoodPlate>({} as IFoodPlate);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const response = await api.get('/foods');

      setFoods(response.data);
    })();
  }, []);

  async function handleAddFood(food: AddFood): Promise<void> {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      })
      setFoods([...foods, response.data])
    } catch (err) {
      console.log(err)
    }
  }

  async function handleEditFood(food: IFoodPlate): Promise<void> {
    setEditModalOpen(true);
    setEditingFood(food)
  }

  async function handleDeleteFood(id : number) {
    await api.delete(`/foods/${id}`)
    const updatedFoods = foods.filter((food: { id: number; }) => food.id !== id)
    setFoods(updatedFoods)
  }

  function toggleModal() {
    setModalOpen(!modalOpen)
  }

  function toggleEditModal() {
    setEditModalOpen(!editModalOpen)
  }

  async function handleUpdateFood(food: AddFood): Promise<void> {
    try {
    const response = await api.put(`/foods/${editingFood.id}`, {
      ...editingFood, ...food
    });

    const updatedFoods = foods.map(f => f.id !== response.data.id ? f : response.data)

    setFoods(updatedFoods);
  } catch (err) {
    console.log(err)
  }
}

  /*
  async function handleUpdateFood(food: Omit<IFoodPlate, 'id' | 'available'>): Promise<void> {
    const response = await api.put(`/foods/${editingFood.id}`, 
    {
      ...editingFood,
      ...food
    }
    )
    const updatedFoods = foods.map((f => f.id !==  response.data.id ? f : response.data))
    setFoods(updatedFoods)
    setEditingFood({} as IFoodPlate)
  }
*/
    return (
      <>
        <Header openModal={toggleModal} />
        <ModalAddFood
          isOpen={modalOpen}
          setIsOpen={toggleModal}
          handleAddFood={handleAddFood}
        />
        <ModalEditFood
          isOpen={editModalOpen}
          setIsOpen={toggleEditModal}
          editingFood={editingFood}
          handleUpdateFood={handleUpdateFood}
        />

        <FoodsContainer data-testid="foods-list">
          {foods &&
            foods.map(food => (
              <Food
                key={food.id}
                food={food}
                handleDelete={handleDeleteFood}
                handleEditFood={handleEditFood}
              />
            ))}
        </FoodsContainer>
      </>
    );
};

export default Dashboard;
