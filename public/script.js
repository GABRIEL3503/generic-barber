  // Tu función para verificar si el usuario está autenticado
  function checkAuthentication() {
    return localStorage.getItem("authenticated") === "true";
  }

// Función para actualizar la UI según el estado de autenticación
  function updateUI() {
    const isAuthenticated = checkAuthentication();
    const clientButtons = document.querySelectorAll('.client-button');
    const statusButtons = document.querySelectorAll('.libre');
    const staButtons = document.querySelectorAll('.ocupado');
    const inputsCliente = document.querySelectorAll('.tu-clase-input');
    const botonesGuardar = document.querySelectorAll('.tu-clase-boton');
    const reserveButtons = document.querySelectorAll('.reserve-button');


    if (isAuthenticated) {
      clientButtons.forEach(button => button.style.display = "inline-block");
      statusButtons.forEach(button => button.style.pointerEvents = "all");
      staButtons.forEach(button => button.style.pointerEvents = "all");
      inputsCliente.forEach(input => input.style.display = "block");
      botonesGuardar.forEach(button => button.style.display = "block");
      reserveButtons.forEach(button => button.style.display = "none"); // Ocultar todos los botones Reservar


    } else {
      clientButtons.forEach(button => button.style.display = "none");
      statusButtons.forEach(button => button.classList.add("disabled"));
      staButtons.forEach(button => button.style.pointerEvents = "disabled");
      inputsCliente.forEach(input => input.style.display = "none");
    botonesGuardar.forEach(button => button.style.display = "none");
    reserveButtons.forEach(button => button.style.display = "block"); // Mostrar todos los botones Reservar

    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    // Botón de login
    const loginButton = document.getElementById("login-button");
  
    document.getElementById("login-button").addEventListener("click", function () {
      // Muestra el modal de SweetAlert para ingresar la contraseña
      Swal.fire({
        title: 'Ingrese su contraseña',
        input: 'password',
        inputPlaceholder: 'Contraseña',
        inputAttributes: {
          autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Login',
        showLoaderOnConfirm: true,
        preConfirm: (password) => {
          return authenticate(password);  // Llama a tu función authenticate
        }
      }).then((result) => {
        if (result.isConfirmed) {
          // Aquí puedes añadir lo que quieras hacer una vez que el usuario esté autenticado
          updateUI();
        }
      });
    });
    
  
    // Tu función para autenticar al usuario
    function authenticate(password) {
      const correctPassword = "admin";
      if (password === correctPassword) {
        localStorage.setItem("authenticated", "true");
        return true;
      } else {
        Swal.showValidationMessage("Contraseña incorrecta");
        return false;
      }
    }
  });
  
// cambia estado del boton
document.addEventListener("DOMContentLoaded", function () {
  // Función para cambiar el estado del botón y actualizar en la base de datos
  function toggleStatus(button) {
    const currentStatus = button.getAttribute("data-status");
    const newStatus = currentStatus === "libre" ? "ocupado" : "libre";
    const turnoId = button.getAttribute("data-id");

    // Actualizar UI
    button.setAttribute("data-status", newStatus);
    button.textContent = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
    button.style.backgroundColor = newStatus === "libre" ? "green" : "red";

    // Actualizar en la base de datos
    fetch(`https://barber-app-wt1u.onrender.com/${turnoId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ estado: newStatus }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Estado actualizado:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }


  fetch('https://barber-app-wt1u.onrender.com/api/turnos')

    .then(response => response.json())
    .then(data => {
      data.forEach(turno => {
        if (turno.hora.length === 1) {
          turno.hora = '0' + turno.hora;
        }
      });

      data.sort((a, b) => {
        return a.hora.localeCompare(b.hora);
      });
      const swiperWrapper = document.querySelector('.swiper-wrapper');

      // Agrupar los turnos por día
      const turnosPorDia = data.reduce((acc, turno) => {
        if (!acc[turno.dia]) {
          acc[turno.dia] = [];
        }
        acc[turno.dia].push(turno);
        return acc;
      }, {});

      // Obtener la fecha actual y calcular las fechas para cada día de la semana
      const hoy = new Date();
      const diasDeLaSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      // Reorganizar el array para que el día actual sea el primero
      const diaActual = diasDeLaSemana[hoy.getDay()];
      const indexDiaActual = diasDeLaSemana.indexOf(diaActual);
      const diasOrdenados = [...diasDeLaSemana.slice(indexDiaActual), ...diasDeLaSemana.slice(0, indexDiaActual)];

      Object.keys(turnosPorDia).sort((a, b) => {
        return diasOrdenados.indexOf(a) - diasOrdenados.indexOf(b);
      }).forEach(dia => {
        const diaDiv = document.createElement('div');
        diaDiv.className = 'swiper-slide dia';

        // Calcular la fecha para este día de la semana
        const fecha = new Date(hoy);
        fecha.setDate(hoy.getDate() + (diasDeLaSemana.indexOf(dia) - hoy.getDay() + 7) % 7);

        // Formatear la fecha para que solo muestre el día y la fecha
        const diaFormateado = `${dia} ${fecha.getDate()}`;

        const titulo = document.createElement('h2');
        titulo.textContent = diaFormateado;
        diaDiv.appendChild(titulo);

        const tabla = document.createElement('table');

        turnosPorDia[dia].forEach(turno => {
          const fila = document.createElement('tr');

          const celdaHora = document.createElement('td');
          celdaHora.textContent = turno.hora;
          fila.appendChild(celdaHora);
          const statusButton = document.createElement('button');
          const celdaBotones = document.createElement('td');
          fetch(`https://barber-app-wt1u.onrender.com/api/clientes/${turno.id}`)
          .then(response => response.json())
          .then(cliente => {
            if (cliente && cliente.nombre) {
              inputCliente.value = cliente.nombre; // Asignar nombre del cliente al campo de texto
              botonGuardar.innerHTML = '-'; // Cambiar el botón a signo menos

            } else {
              botonGuardar.innerHTML = '+'; // Si no hay cliente, asegúrate de que el botón sea '+'
            }
          })
          .catch(error => console.error('Error:', error));

          statusButton.className = turno.estado;
          statusButton.textContent = turno.estado.charAt(0).toUpperCase() + turno.estado.slice(1);
          statusButton.setAttribute("data-status", turno.estado); // Añadir el estado actual como un atributo data
          statusButton.setAttribute("data-id", turno.id); // Añadir el id del turno como un atributo data

          celdaBotones.appendChild(statusButton);
          statusButton.addEventListener("click", function () {
            // Llamar a la función toggleStatus

            const currentStatus = this.getAttribute("data-status");

            toggleStatus(this);
          });



          // Crear campo de texto para nombre del cliente
          const inputCliente = document.createElement('input');
          inputCliente.setAttribute('type', 'text');
          inputCliente.setAttribute('placeholder', 'Nombre o Teléfono');
          inputCliente.classList.add('tu-clase-input'); // Asegúrate de usar las clases adecuadas
        

          // Crear botón para guardar la información del cliente
          const botonGuardar = document.createElement('button');
          botonGuardar.innerHTML = '+'; // Puedes cambiar esto por un icono si prefieres
          botonGuardar.classList.add('tu-clase-boton'); // Usa las clases adecuadas
          botonGuardar.id = 'guardarCliente';

          // Agregar el campo de texto y el botón al DOM
          celdaBotones.appendChild(inputCliente);
          celdaBotones.appendChild(botonGuardar);


          botonGuardar.addEventListener('click', function() {
            const nombre = inputCliente.value;
            const turnoId = statusButton.getAttribute("data-id");
          
            if (botonGuardar.innerHTML === '+') {
              fetch(`https://barber-app-wt1u.onrender.com/api/clientes`, {
                method: 'POST', // o 'PUT'
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nombre, turnoId }),
              })
              .then(response => response.json())
              .then(data => {
                console.log('Cliente guardado:', data);
                botonGuardar.innerHTML = '-'; // Cambiar a signo menos
              })
              .catch(error => console.error('Error:', error));
            }
            else {
              fetch(`https://barber-app-wt1u.onrender.com/api/clientes/${turnoId}`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                }
              })
              .then(response => response.json())
              .then(data => {
                console.log('Cliente eliminado:', data);
                botonGuardar.innerHTML = '+'; // Cambiar a signo más
              })
              .catch(error => console.error('Error:', error));
            }
            
          });      

          const reserveButton = document.createElement('button');
          reserveButton.textContent = 'Reservar';
          reserveButton.classList.add('reserve-button'); // Agregar la clase en lugar del ID
          
          // Asignar la URL al evento 'click' del botón
          var cbu = "0000003100035584071991";
          var aliasCBU = "alemonkeys";
          var phoneNumber = "+5492996738175";
          reserveButton.addEventListener("click", function () {
            // Capturar la fecha y la hora del turno actual
            let fecha = diaFormateado;
            // Asegúrate de que esto coincide con cómo obtienes la fecha desde el backend
            let hora = turno.hora;  // Asegúrate de que esto coincide con cómo obtienes la hora desde el backend

            // Construir el mensaje
            let mensaje = `Hola! Quiero reservar un turno para el día ${fecha} a las ${hora}. Te comparto el coprobante de pago de la seña `;

            // Codificar el mensaje
            let mensajeCodificado = encodeURIComponent(mensaje);

            // Construir la URL completa
            let urlWhatsApp = `https://api.whatsapp.com/send?phone=2996738175&text=${mensajeCodificado}`;
            // Muestra el SweetAlert
            Swal.fire({
              html: `
      <p>👉Para finalizar realizá <br> una seña de $400 <br> 💈 Si no podés asistir avisá con anticipación, y tu seña quedará a favor <br> en tu próximo corte 💈 Gracias.</p>
  
      <div id="acciones" style="display: flex; flex-direction: column;">
        
        <a href="javascript:void(0);" id="copyAlias" class="link-accion">COPIAR ALIAS</a>
        <a href="${urlWhatsApp}" target="_blank" class="link-accion">COMPARTIR COMPROBANTE</a>
      </div>
    `,
              imageUrl: './img/Logo APP Barbe generica.png',
              imageWidth: 320,
              imageHeight: 320,
              imageAlt: 'Un logo personalizado',
              showCancelButton: false, // Ocultamos el botón de cancelar
              showConfirmButton: false, // No se muestra el botón de confirmar
              showCloseButton: true, // Mostramos la cruz para cerrar
              closeButtonHtml: '&times;',
            });

          });

          // Copiar CBU o Alias al portapapeles
          document.addEventListener('click', function (event) {
            if (event.target.id === 'copyCBU' || event.target.id === 'copyAlias') {
              const textToCopy = event.target.id === 'copyCBU' ? cbu : aliasCBU;
              navigator.clipboard.writeText(textToCopy).then(() => {
                event.target.textContent = `${event.target.id === 'copyCBU' ? 'CBU' : 'Alias'} Copiado`; // Cambiar texto del enlace
                setTimeout(() => {
                  event.target.textContent = `Copiar ${event.target.id === 'copyCBU' ? 'CBU' : 'Alias'}`; // Restablecer texto después de 2 segundos
                }, 2000);
              }).catch(err => {
                Swal.showValidationMessage(`Error: ${err}`);
              });
            }
          });

          // Aquí podrías añadir un evento para realizar la reserva
          celdaBotones.appendChild(reserveButton);

          fila.appendChild(celdaBotones);
          tabla.appendChild(fila);
        
        });

        diaDiv.appendChild(tabla);
        swiperWrapper.appendChild(diaDiv);
      });


      updateUI();

    })
    .catch(error => console.error('Error:', error));
});



// document.addEventListener("DOMContentLoaded", function() {
//   updateUI();
// });