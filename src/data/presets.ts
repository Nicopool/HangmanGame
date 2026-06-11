import { PresetCategory } from '../types';

export const presetCategories: PresetCategory[] = [
  {
    id: 'technology',
    nameEn: 'Technology',
    nameEs: 'Tecnología',
    descriptionEn: 'Computers, artificial intelligence, programming, and digital devices.',
    descriptionEs: 'Computación, inteligencia artificial, programación y dispositivos digitales.',
    wordsEn: [
      { word: 'ALGORITHM', hint1: 'A step-by-step set of operations or rules to solve a problem.', hint2: 'Begins with "A", runs behind all code logic.' },
      { word: 'DATABASE', hint1: 'A structured, organized collection of stored digital records.', hint2: 'SQL databases like PostgreSQL and MySQL are popular examples.' },
      { word: 'COMPILER', hint1: 'Translates high-level programming code into machine language.', hint2: 'Saves your source code into an executable file.' },
      { word: 'BANDWIDTH', hint1: 'The maximum rate of data transfer across a network path.', hint2: 'Measured in bits per second, higher means faster downloads.' },
      { word: 'FIREWALL', hint1: 'A dynamic barrier monitoring incoming and outgoing network traffic.', hint2: 'Blocks unauthorized access or malicious hackers.' },
      { word: 'HARDWARE', hint1: 'The physical, tangible components of a computing terminal.', hint2: 'Includes mouse, keyboard, memory modules, and CPUs.' },
      { word: 'FRAMEWORK', hint1: 'A platform providing a structured foundation to build software.', hint2: 'React, Angular, and Vue are frontend examples of this.' }
    ],
    wordsEs: [
      { word: 'ALGORITMO', hint1: 'Conjunto de instrucciones ordenadas para resolver un problema.', hint2: 'Empieza con "A" y corre detrás de la lógica del código.' },
      { word: 'PROCESADOR', hint1: 'El cerebro electrónico que ejecuta los cálculos lógicos.', hint2: 'Unidades centrales de procesamiento como Intel o AMD.' },
      { word: 'INTERNET', hint1: 'La red mundial descentralizada de interconexión física.', hint2: 'Navegamos a través de ella usando navegadores de internet.' },
      { word: 'PROGRAMA', hint1: 'Conjunto de enunciados lógicos creados para realizar una tarea.', hint2: 'Software instalado en un dispositivo móvil o escritorio.' },
      { word: 'SERVIDOR', hint1: 'Equipo de cómputo remoto que atiende peticiones de red.', hint2: 'Normalmente aloja bases de datos e imágenes en la nube.' },
      { word: 'INTERFAZ', hint1: 'Zona de interacción gráfica que comunica al usuario con el sistema.', hint2: 'Controles visuales, menús, botones y sliders.' }
    ]
  },
  {
    id: 'science',
    nameEn: 'Science & Cosmos',
    nameEs: 'Ciencia y Cosmos',
    descriptionEn: 'Physics, biology, space chemistry, and celestial terminology.',
    descriptionEs: 'Física, biología, química del espacio y terminología celestial.',
    wordsEn: [
      { word: 'GALAXY', hint1: 'A colossal system of stars, stellar remnants, gas, and dark matter.', hint2: 'Our home is called the "Milky Way".' },
      { word: 'ASTEROID', hint1: 'A small rocky object orbiting the inner Solar System.', hint2: 'Unlike comets, they do not create a glowing chemical tail.' },
      { word: 'MOLECULE', hint1: 'A group of two or more atoms chemically bonded together.', hint2: 'Water (H2O) is a classic chemical example.' },
      { word: 'BACTERIA', hint1: 'Microscopic, single-celled organisms found in virtually all environments.', hint2: 'Can be studied in microbiology, some are useful while some cause disease.' },
      { word: 'DNA', hint1: 'The dynamic blueprint carrying genetic instructions for living beings.', hint2: 'Shaped like a repeating double helix molecule.' },
      { word: 'GRAVITY', hint1: 'The invisible force that pulls matter toward the center of a mass.', hint2: 'Keeps the planets in our solar system revolving around the Sun.' }
    ],
    wordsEs: [
      { word: 'GRAVEDAD', hint1: 'La fuerza invisible que atrae los cuerpos celestes entre sí.', hint2: 'Nivel cero mantiene nuestros pies sobre el suelo terrestre.' },
      { word: 'GALAXIA', hint1: 'Colosal sistema cósmico compuesto por polvo, estrellas y nebulosas.', hint2: 'La nuestra posee forma espiral y se llama Vía Láctea.' },
      { word: 'QUIMICA', hint1: 'Estudio de la composición, estructura y propiedades de la materia.', hint2: 'Trabaja intensamente con la tabla periódica de elementos.' },
      { word: 'NEBULOSA', hint1: 'Nube gigante de polvo cósmico interestelar y helio/hidrógeno.', hint2: 'Cuna espacial de nacimiento de nuevas estrellas.' },
      { word: 'GENETICA', hint1: 'Rama biológica que investiga la herencia y los genes celulares.', hint2: 'Analiza la secuencia química del ADN.' }
    ]
  },
  {
    id: 'geography',
    nameEn: 'World Geography',
    nameEs: 'Geografía Mundial',
    descriptionEn: 'Continents, majestic oceans, countries, and natural wonders.',
    descriptionEs: 'Continentes, océanos majestuosos, naciones y maravillas del mundo.',
    wordsEn: [
      { word: 'CONTINENT', hint1: 'One of the several very large landmasses of our Planet Earth.', hint2: 'There are seven major ones, including Africa and Asia.' },
      { word: 'ARCHIPELAGO', hint1: 'A dynamic cluster, chain, or collection of numerous islands.', hint2: 'Japan, Hawaii, and the Maldives are beautiful examples.' },
      { word: 'PENINSULA', hint1: 'A piece of land surrounded by water on three sides.', hint2: 'Florida and Italy are classic geographical examples.' },
      { word: 'EQUATOR', hint1: 'An imaginary line drawn around the Earth dividing north and south.', hint2: 'Located at exact zero degrees latitude.' },
      { word: 'HIMALAYAS', hint1: 'The highest mountain range on Earth, situated in south-central Asia.', hint2: 'Contains the world\'s tallest mountain peak, Mount Everest.' }
    ],
    wordsEs: [
      { word: 'PENINSULA', hint1: 'Extensión territorial rodeada de agua de mar por tres lados.', hint2: 'España e Italia son ejemplos de este accidente geográfico.' },
      { word: 'VOLCAN', hint1: 'Estructura geológica que expulsa magma hirviendo desde el manto.', hint2: 'Se conecta con cámaras internas de lava terrestre.' },
      { word: 'CORDILLERA', hint1: 'Sucesión continua o cadena gigante de montañas unidas.', hint2: 'La de los Andes atraviesa toda Sudamérica.' },
      { word: 'ELEVACION', hint1: 'Distancia vertical medida sobre el nivel medio del mar.', hint2: 'Término equivalente a "altitud".' }
    ]
  },
  {
    id: 'cinema',
    nameEn: 'Cinema & Arts',
    nameEs: 'Cine y Artes',
    descriptionEn: 'Theatrical terms, famous film genres, and creative practices.',
    descriptionEs: 'Términos teatrales, géneros estelares de cine y prácticas creativas.',
    wordsEn: [
      { word: 'DIRECTOR', hint1: 'Coordinates the artistic, dramatic, and visual aspects of a movie.', hint2: 'Shouts "Action!" and "Cut!" on the set.' },
      { word: 'SOUNDTRACK', hint1: 'The recorded musical scores accompanying and highlighting a film.', hint2: 'Can be composed by artists like John Williams or Hans Zimmer.' },
      { word: 'CINEMATOGRAPHY', hint1: 'The elaborate craft of recording motion-picture photography and lighting.', hint2: 'Determines color grading, camera lenses, and framing style.' },
      { word: 'PROTAGONIST', hint1: 'The absolute central leading character within a dramatic story.', hint2: 'Faces the direct opposition of the antagonist.' }
    ],
    wordsEs: [
      { word: 'PELICULA', hint1: 'Proyección secuencial de fotogramas que capturan movimiento.', hint2: 'Se proyecta en salas oscuras de cine comerciales.' },
      { word: 'DIRECTOR', hint1: 'La mente creativa líder detrás de cámaras que dirige a actores.', hint2: 'Grita la icónica frase "¡Acción!" en el set.' },
      { word: 'ESCENARIO', hint1: 'Espacio físico teatral diseñado para desplegar obras y arte.', hint2: 'Suele contar con telones, tramoyas y luces dirigidas.' },
      { word: 'GUIONISTA', hint1: 'La persona encargada de redactar los diálogos y la trama escrita.', hint2: 'Crea el libreto base antes de filmar una escena.' }
    ]
  }
];
