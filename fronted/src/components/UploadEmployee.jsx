import React, { useState } from 'react';

const UploadEmployee = () => {
  const [image, setImage] = useState(null);
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('image', image);
    formData.append('name', name);
    formData.append('position', position);

    const response = await fetch('http://localhost:5000/api/staff/upload', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      alert('Hodim ma\'lumotlari muvaffaqiyatli yuklandi!');
    } else {
      alert('Xato yuz berdi!');
    }
  };

  return (
    <div>
      <h2>Hodimni yuklash</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Rasm:</label>
          <input type="file" onChange={handleImageChange} required />
        </div>
        <div>
          <label>Ism:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Lavozim:</label>
          <input
            type="text"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            required
          />
        </div>
        <button type="submit">Yuklash</button>
      </form>
    </div>
  );
};

export default UploadEmployee;
