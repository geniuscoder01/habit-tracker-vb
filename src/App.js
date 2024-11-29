import React, { useState, useEffect } from 'react'
import './styles.css'

function App() {
  const [habitList, setHabitList] = useState([]);
  const [newHabitText, setNewHabitText] = useState('');
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');
  const [isDark, setIsDark] = useState(false);

  const week = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  useEffect(() => {
    const saved = localStorage.getItem('habitList');
    if (saved) {
      setHabitList(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('habitList', JSON.stringify(habitList));
  }, [habitList]);

  function addHabit() {
    if (!newHabitText.trim()) return;
    setHabitList([...habitList, {
      id: Date.now(),
      name: newHabitText,
      days: [false, false, false, false, false, false, false],
    }]);
    setNewHabitText('');
  }

  function changeDay(habitId, dayIdx) {
    setHabitList(habitList.map(h => {
      if (h.id === habitId) {
        const newDays = [...h.days];
        newDays[dayIdx] = !newDays[dayIdx];
        return { ...h, days: newDays };
      }
      return h;
    }));
  }

  function removeHabit(id) {
    setHabitList(habitList.filter(h => h.id !== id));
  }

  function startEdit(habit) {
    setEditId(habit.id);
    setEditText(habit.name);
  }

  function saveEdit() {
    setHabitList(habitList.map(h => h.id === editId ? { ...h, name: editText } : h));
    setEditId(null);
    setEditText('');
  }

  function progress(habitDays) {
    const completed = habitDays.filter(day => day).length;
    return Math.round((completed / 7) * 100);
  }

  return (
    <div className={isDark ? 'dark' : ''}>
      <h1>My Habits</h1>
      <button onClick={() => setIsDark(!isDark)}>
        {isDark ? 'lightmode' : 'dark mode'}
      </button>
      <div>
        <input
          value={newHabitText}
          onChange={(e) => setNewHabitText(e.target.value)}
          placeholder="Enter habit"
        />
        <button onClick={addHabit}>Add</button>
      </div>
      <div>
        {habitList.map(habit => (
          <div key={habit.id}>
            {editId === habit.id ? (
              <>
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <button onClick={saveEdit}>Save</button>
              </>
            ) : (
              <>
                <span>{habit.name}</span>
                <button onClick={() => startEdit(habit)}>Edit</button>
                <button onClick={() => removeHabit(habit.id)}>Delete</button>
              </>
            )}
            <div>
              {week.map((day, idx) => (
                <button
                  key={idx}
                  onClick={() => changeDay(habit.id, idx)}
                  style={{ backgroundColor: habit.days[idx] ? 'green' : 'lightgray' }}
                >
                  {day}
                </button>
              ))}
            </div>
            <p>Progress: {progress(habit.days)}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;