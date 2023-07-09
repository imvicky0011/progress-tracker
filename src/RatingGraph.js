import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


export default function RatingGraph({ data }) {
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);

    const handleDateChange = (date) => {
      setSelectedDate(date);
    };

    useEffect(() => {
        console.log(selectedDate)
        if(!selectedDate) {
            const currentDate = new Date();
            const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
            const currentYear = currentDate.getFullYear();
        
            setMonth(currentMonth);
            setYear(currentYear.toString());
        }

        else {
            const currentDate = selectedDate;
            const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
            const currentYear = currentDate.getFullYear();
            
            console.log(currentMonth)
            console.log(currentYear)
            
            setMonth(currentMonth);
            setYear(currentYear.toString());
        }
    }, [selectedDate]);
  
    // const transformedData = data.map(obj => ({
    //     Date: obj.formattedDate,
    //     Rating: obj.rating
    // }));

     // Filter the objects based on month and year
    const transformedData = data
  .filter(obj => {
    const [objDay, objMonth, objYear] = obj.formattedDate.split('/');
    
    console.log(objDay)

    if (objMonth === month && objYear === year) {
      return true;
    }
    return false;
  })
  .sort((a, b) => {
    const [aDay, aMonth, aYear] = a.formattedDate.split('/');
    const [bDay, bMonth, bYear] = b.formattedDate.split('/');
    const aDate = new Date(aYear, aMonth - 1, aDay);
    const bDate = new Date(bYear, bMonth - 1, bDay);
    return aDate - bDate;
  });

    console.log("printing the lists of transformed Data")
    console.log(transformedData)

  return (
        <div>

        <div style = {{display: 'flex', flexDirection: 'row', marginTop:'-15px'}}>
          <h3 style={{margin:'0', padding:'0'}} >Pick The Date and Month</h3>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            showMonthYearPicker
            dateFormat="MM/yyyy"
            showFullMonthYearPicker
          />
        </div>

            <LineChart width={1100} height={400} data={transformedData}>
              <XAxis dataKey="formattedDate" />
              <YAxis domain={[0, 5]} tickCount={6} />
              <CartesianGrid strokeDasharray="1 1" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="rating" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
        </div>
  );
}
