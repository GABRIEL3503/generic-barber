const sqlite3 = require('sqlite3').verbose();

// abrir la base de datos
let db = new sqlite3.Database('./turnos.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Conectado a la base de datos.');
});

db.serialize(() => {
  // crear tabla de turnos
  db.run(`CREATE TABLE IF NOT EXISTS turnos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dia TEXT,
    fecha TEXT,
    hora TEXT,
    estado TEXT DEFAULT 'libre',
    cliente_id INTEGER,
    FOREIGN KEY (cliente_id) REFERENCES clientes (id)
  );`);

  // crear tabla de clientes
  db.run(`CREATE TABLE IF NOT EXISTS clientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT,
    telefono TEXT,
    email TEXT
  );`);

  const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const horarios = Array.from({ length: 14 }, (_, i) => 9 + i);
  const minutos = [0, 30];

  dias.forEach((dia) => {
    horarios.forEach((hora) => {
      minutos.forEach((minuto) => {
        const paddedHora = hora.toString().padStart(2, '0');
        const paddedMinuto = minuto.toString().padStart(2, '0');
        const sql = `INSERT INTO turnos (dia, hora, estado) VALUES (?, ?, 'libre')`;
        db.run(sql, [dia, `${paddedHora}:${paddedMinuto}`], function(err) {
          if (err) {
            return console.error(err.message);
          }
          console.log(`Se ha insertado el turno: ${dia} - ${paddedHora}:${paddedMinuto}`);
        });
      });
    });
  });

  // cerrar la base de datos
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Base de datos cerrada.');
  });
});
