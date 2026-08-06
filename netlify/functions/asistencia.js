exports.handler = async (event) => {

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Método no permitido"
    };
  }

  try {

    const respuesta = await fetch(
      "https://script.google.com/macros/s/AKfycbyAbMtqKhKBrFLGI1PVh5pbNw__ouLEEQazLYEHT0qCmwKmHtOqrGkt9QS-QsQX0ey4/exec",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: event.body
      }
    );

    const texto = await respuesta.text();

    return {
      statusCode: 200,
      body: texto
    };

  } catch (err) {

    return {
      statusCode: 500,
      body: err.toString()
    };

  }

};