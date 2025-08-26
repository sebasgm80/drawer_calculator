import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../hooks/useUserContext';
import { logger } from '../utils/logger';
import './ListPage.css';

const ListPage = () => {
  const { resultsList, updateResultName, removeResult } = useUserContext();
  const navigate = useNavigate();
  const [editId, setEditId] = useState(null);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    logger('Results List in ListPage:', resultsList);
  }, [resultsList]);

  const handleRename = (id) => {
    updateResultName(id, newName);
    setEditId(null);
    setNewName('');
  };

  const handleEdit = (result) => {
    navigate('/calculator', { state: { result } });
  };

  const renderResultDetails = (result) => {
    const drawerHeight = typeof result.drawerHeight === 'string' ? JSON.parse(result.drawerHeight) : result.drawerHeight;

    if (result.numDrawers < 3) {
      return (
        <>
          <div>
            <h4>Travesaños:</h4>
            <p>{result.travesanos.total} de {result.travesanos.length} x {result.travesanos.height} x {result.travesanos.thickness} mm</p>
          </div>
          <div>
            <h4>Laterales:</h4>
            <p>{result.laterales.total} de {result.laterales.length} x {drawerHeight} x {result.laterales.thickness} mm</p>
          </div>
          <div>
            <h4>Fondos:</h4>
            <p>{result.fondos.total} de {result.fondos.length} x {result.fondos.width} x {result.fondos.thickness} mm</p>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div>
            <h4>Travesaños superior/inferior:</h4>
            <p>4 de {result.travesanos.length} x {result.travesanosAltura.topBottomTravesanosAltura} x {result.travesanos.thickness} mm</p>
          </div>
          <div>
            <h4>Laterales superior/inferior:</h4>
            <p>4 de {result.laterales.length} x {drawerHeight.topBottomHeight} x {result.laterales.thickness} mm</p>
          </div>
          <div>
            <h4>Travesaños centrales:</h4>
            <p>{result.travesanos.total - 4} de {result.travesanos.length} x {result.travesanosAltura.centralTravesanosAltura} x {result.travesanos.thickness} mm</p>
          </div>
          <div>
            <h4>Laterales centrales:</h4>
            <p>{result.laterales.total - 4} de {result.laterales.length} x {drawerHeight.centralHeight} x {result.laterales.thickness} mm</p>
          </div>
          <div>
            <h4>Fondos:</h4>
            <p>{result.fondos.total} de {result.fondos.length} x {result.fondos.width} x {result.fondos.thickness} mm</p>
          </div>
        </>
      );
    }
  };

  return (
    <div className="list-container">
      <h2>Lista de proyectos</h2>
      <ul>
        {resultsList.length > 0 ? resultsList.map((result) => (
          <li className="list-item" key={result.id}>
            {editId === result.id ? (
              <>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
                <button onClick={() => handleRename(result.id)}>Guardar</button>
              </>
            ) : (
              <>
                <span className="result-name">{result.name}</span>
                <button onClick={() => { setEditId(result.id); setNewName(result.name); }}>Renombrar</button>
              </>
            )}
            <button onClick={() => handleEdit(result)}>Editar</button>
            <button onClick={() => removeResult(result.id)}>Eliminar</button>
            <figure>
              {renderResultDetails(result)}
            </figure>
          </li>
        )) : <p>No hay proyectos.</p>}
      </ul>
    </div>
  );
};

export default ListPage;
