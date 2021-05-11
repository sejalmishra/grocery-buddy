import React, {useState,useEffect} from 'react';
import List from './list';
import Alert from './alert';

const getLocalStorage = () => {
  let list = localStorage.getItem('list');
  if(list) {
    return (list = JSON.parse(localStorage.getItem('list')));
  }
  else {
    return [];
  }
};

function App() {
  const [name, setName] = useState('');
  const [list, setList] = useState(getLocalStorage());
  const [alert, setAlert] = useState({show: false, msg: '', type: ''});
  const [editId, setEditId] = useState(null);
  const [isEditting, setIsEditting] = useState(false);

  const handelSubmit = (e) => {
    e.preventDefault();
    if(!name){
      showAlert(true, 'please enter a value', 'danger');
    }
    if(name && isEditting) {
      setList(
        list.map((item) => {
          if(item.id === editId) {
            return {...list, title: name};
          }
          return item;
        })
      ) 
      setName('');
      setEditId(null);
      setIsEditting(false);
      showAlert(true, 'value changed', 'success');
    }
    else {
      showAlert(true, 'Item Added', 'success')
      const newItem = { id: new Date().getTime().toString(), title: name};
      setList([...list, newItem]);
      setName('');
    }
  };

  const showAlert = (show = false, msg = '', type = '') => {
    setAlert({show, msg, type});
  };

  const clearItems = () => {
    showAlert(true, 'List cleared','danger')
    setList([]);
  };

  const deleteItem = (id) => {
    showAlert(true, 'Item Deleted', 'danger');
    setList(list.filter((item) => item.id !== id));
  };

  const editItem = (id) => {
    const particularItem = list.find((item) => item.id === id);
    setIsEditting(true);
    setEditId(id);
    setName(particularItem.title);
  };

  useEffect(() => {
    localStorage.setItem('list', JSON.stringify(list));
  }, [list])

  return (
      <section className='section-center'>
          <form className='grocery-form' onSubmit={handelSubmit}>
          {alert.show && <Alert {...alert} removeAlert={showAlert} list={list}/>}
           
            <h3>Grocery Bud</h3>
            <div className='form-control'>
            <input type='text' className='grocery' placeholder='e.g. eggs' value={name} onChange={(e) => {setName(e.target.value)}} />
            <button type='submit' className='submit-btn'>
            {isEditting ? 'Edit' : 'Submit'}
            </button>
            </div>
          </form>
        {list.length > 0 && (
          <div className='grocery-container'><List list={list} deleteItem={deleteItem} editItem={editItem}/>
        <button className='clear-btn' onClick={clearItems}>Clear Items</button>
        </div>
        )}
      </section>
  );
}

export default App;
