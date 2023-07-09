import React, { useState, useEffect } from 'react';
import './App.css';
import RatingGraph from './RatingGraph';
import {db} from './firebase'
import {
  query,
  collection,
  onSnapshot,
  addDoc
} from 'firebase/firestore'


function getRating(data) {
  let total = 0;
  total = parseInt(data["CP"]) + parseInt(data["DSA"]) + parseInt(data["Dev"]) + parseInt(data["Project"]) + parseInt(data["Gym"]);
  total = total / 5;
  return total;
}


function App() {
  const [formData, setFormData] = useState([]);
  const [DSA, setDSA] = useState('0');
  const [CP, setCP] = useState('0');
  const [Project, setProject] = useState('0');
  const [Dev, setDev] = useState('0');
  const [Gym, setGym] = useState('0');


  useEffect(() => {
  
    const q = query(collection(db, 'ProgressTracker'));
  
    onSnapshot(q, (querySnapshot) => {
      
      let resArr = [];
      querySnapshot.forEach((doc) => {
        resArr.push({ ...doc.data(), id: doc.id });
      });
      
      setFormData(resArr);
    });
  }, []);
  

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  });
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const newFormData = { DSA, CP, Project, Dev, Gym, formattedDate, rating: 0 };
    const finalRating = getRating(newFormData);
    newFormData["rating"] = finalRating;
    console.log("final new form data");
    console.log(newFormData)

    
    const existingObject = formData.find(obj => obj.formattedDate === formattedDate);
    
    if (existingObject) {
      alert('Progess for today has already been recorded.');
      return;
    }
    
    // Create a new object with the form data
    await addDoc(collection(db, 'ProgressTracker'), newFormData);
    
    // Add the new object to the existing array
    setFormData([...formData, newFormData]);

    // Clear the form inputs
    setDSA('0');
    setCP('0');
    setProject('0');
    setDev('0');
    setGym('0');
  };

  return (
    <div className="container">
      <form className="form" onSubmit={handleSubmit}>
        <h2>Enter the work of {formattedDate} </h2>
        <div className="form-group">
          <label htmlFor="dsa">DSA (5):</label>
          <input
            type="text"
            id="dsa"
            value={DSA}
            onChange={(event) => setDSA(event.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="project">Project (5):</label>
          <input
            type="text"
            id="project"
            value={Project}
            onChange={(event) => setProject(event.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="cp">CP (5):</label>
          <input
            type="text"
            id="cp"
            value={CP}
            onChange={(event) => setCP(event.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="dev">Dev (5):</label>
          <input
            type="text"
            id="dev"
            value={Dev}
            onChange={(event) => setDev(event.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="gym">Gym (5):</label>
          <input
            type="text"
            id="gym"
            value={Gym}
            onChange={(event) => setGym(event.target.value)}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>

      <div className='displayData'>
        <RatingGraph data={formData} />
      </div>
    </div>
  );
}

export default App;
