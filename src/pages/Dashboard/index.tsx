import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';
import { IFoodPlate } from '../../types/Food';

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

  async function handleAddFood(food: Omit<IFoodPlate, 'id' | 'available'>) {
    try {
      const response = await api.post('/foods', food)
      setFoods([...foods, response.data])
    } catch (err) {
      console.log(err)
    }
  }

  async function handleEditFood(food: Omit<IFoodPlate, 'id' | 'available'>) {
    const response = await api.put(`/foods/${editingFood.id}`, food)
    const updatedFoods = foods.map((f: { id: number; } ) => f.id === editingFood.id ? response.data : f)
    setFoods(updatedFoods)
    setEditingFood({} as IFoodPlate)
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

  function handleUpdateFood(food: IFoodPlate) {
    setEditingFood(food)
    toggleEditModal()
  }

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
            foods.map((food: { id: any; }) => (
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