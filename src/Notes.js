import React, { useState, useEffect } from 'react';
import Draggable from 'react-draggable';

const Notes = () => {
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState([]);

  // Odczytaj notatki z localStorage przy pierwszym renderze
  useEffect(() => {
    const savedNotes = JSON.parse(window.localStorage.getItem('REMEMBER_NOTE')) || [];
    setNotes(savedNotes);
    setShowNotes(savedNotes.length >= 0);
  }, []);
  useEffect(() => {
    if (notes.length > 0) {
      window.localStorage.setItem('REMEMBER_NOTE', JSON.stringify(notes));
    }
  }, [notes]);

  const addNote = () => {
    setShowNotes(true);
    if (notes.length < 9) {
      const newNote = { id: Date.now(), text: '', x: 0, y: 100 };
      setNotes([...notes, newNote]);
    } else {
      alert('Możesz stworzyć maksymalnie 9 notatek.');
    }
  };

  const updateNote = (id, text) => {
    setNotes(notes.map(note => (note.id === id ? { ...note, text } : note)));
  };

  const deleteNote = (id) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    console.log('Deleting note with id:', id);
    console.log('Updated notes:', updatedNotes);
    setNotes(updatedNotes);
    if (updatedNotes.length === 0) {
        window.localStorage.removeItem('REMEMBER_NOTE');
        setShowNotes(false);
      } else {
        window.localStorage.setItem('REMEMBER_NOTE', JSON.stringify(updatedNotes));
      }
  };

  const handleDrag = (e, data, id) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, x: data.x, y: data.y } : note
    ));
  };

  return (
    <div className="content">
      {showNotes && (
        <div className="notesContainer">
          {notes.map(note => (
            <Draggable 
              key={note.id}
              defaultPosition={{ x: note.x, y: note.y }}
              onDrag={(e, data) => handleDrag(e, data, note.id)}
            >
              <div className="note">
                <textarea 
                  value={note.text} 
                  onChange={(e) => updateNote(note.id, e.target.value)} 
                  placeholder="Napisz swoją notatkę..."
                />
                <button className="deleteButton" onClick={() => deleteNote(note.id)}>X</button>
              </div>
            </Draggable>
          ))}
        </div>
      )}
      <button className="btnNote" onClick={addNote}>Dodaj Notatkę</button>
    </div>
  );
};

export default Notes;
