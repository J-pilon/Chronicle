import TextButton from '../TextButton';
import { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../hooks/UserContext';

const CategoryItem = (props) => {
  const { name, id, setCategoryId, categoryId} = props;
  const { userRef } = useContext(UserContext);
  const user = userRef.current;
  const [color, setColor] = useState<string>('black')


  const changeCategory = () => {
    categoryId !== id 
    ? setCategoryId(id)
    : setCategoryId(null);
    
    console.log('I\'m the category id!!!!', categoryId);
  };
   
  useEffect (() => {
    setColor(user.text_hex)
  }, [user]);
   
  useEffect (() => {
    categoryId === id 
    ? setColor(user.accent_hex)
    : setColor(user.text_hex);
  }, [categoryId, user, id]);

  return (
    <TextButton onClick={changeCategory}
    save={changeCategory}
    color={color}
    text={name}/>
  );
};

export default CategoryItem;