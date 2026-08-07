exports.handler = async (event) => {

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Método no permitido"
    };
  }

  try {

    const datos = JSON.parse(event.body);

    const respuesta = await fetch(
      "https://script.google.com/macros/s/AKfycbyAbMtqKhKBrFLGI1PVh5pbNw__ouLEEQazLYEHT0qCmwKmHtOqrGkt9QS-QsQX0ey4/exec",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          accion: "buscar",
          email: datos.email
        })
      }
    );

    const texto = await respuesta.text();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: texto
    };

  } catch (err) {

    return {
      statusCode: 500,
      body: JSON.stringify({
        encontrado: false,
        error: err.toString()
      })
    };

  }

};