import { Switch, Route } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { UserContext } from '../hooks/UserContext';
import axios from 'axios';
import Category from './Category';


const Categories = () => {
  const { userRef } = useContext(UserContext);
  const user = userRef.current;
  console.log('from categories', user);
  const [categories, setCategories] = useState<any>([]);
  useEffect(() => {
    axios.get('/api/categories')
      .then((res) => {
        setCategories(res.data);
      })
  }, [])

  return (
    <div>
      <h2>Categories</h2>
      <Switch>  
      <Route path="/category/:id" component={Category} >
      <ul>
        {categories.map(item=> (
          <li>{item.name}</li>
        ))}
      </ul>
      </Route>
      </Switch>
      </div>

  );
};

export default Categories;
