// Registrar un filtro
// tomará como parámetro una fecha en formato timestamp y la transformará en una fecha con formato legible para humanos (gracias a la libreria moment)
Vue.filter('date', (time) => moment(time).format('DD/MM/YY, HH:mm'))

new Vue({
  el: '#notebook',
  data() {
    return {
      // Recuperamos las notas almacenadas en localstorage, pero convertimos el valor retornado a su tipo de datos nativo (array de objetos). En caso contrario retornamos un array vacio
      notes: JSON.parse(localStorage.getItem('notes')) || [],
      // recuperamos el id de la ultima nota seleccionada, en caso contrario retornamos null (trabajar con id es mas práctico que con el objeto de nota completo)
      selectedId: localStorage.getItem('selected-id') || null,
    }
  },
  // Los métodos son funciones reutilizables dentro de nuestra aplicación de Vuejs. Los cuales pueden ser invocados por medio de acciones en la vista de nuestra aplicación, por otros métodos, u observadores.
  methods: {
    saveNotes() {
      // Solo podemos almacenar cadenas en localStorage, por tanto, convertimos nuestro arreglo de objetos en cadena
      localStorage.setItem('notes', JSON.stringify(this.notes))
      console.log('Notas guardadas', new Date())
    },
    addNote() {
      // Agregar una nota con contenido predeterminado
      const time = Date.now()
      const note = {
        id: String(time),
        title: 'Nueva nota',
        content: '**Hola!** Esta es una nota usando [markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) para formatear',
        created: time,
        favorite: false
      }
      // Añadir la nueva nota a la lista de notas
      this.notes.push(note)
    },
    selectNote(note) {
      // Establecer el id de la nota seleccionada desde la vista
      this.selectedId = note.id
    },
    removeNote() {
      if (this.selectedNote && confirm('¿Desea eliminar la nota seleccionada?')) {
        // Buscar el indice de la nota seleccionada en el arreglo de notas
        const index = this.notes.indexOf(this.selectedNote)
        if (index !== -1) {
          // Remover la nota del array de notas
          this.notes.splice(index, 1)
        }
      }
    },
    favoriteNote() {
      // Este metodo invierte el valor booleano de la propiedad favorita de una nota (favorita a no favorita y viceversa)
      this.selectedNote.favorite = !this.selectedNote.favorite
    }
  },
  // Las propiedades computadas son nuevas propiedades que combinan cualquier cantidad de propiedades de nuestro modelo, con la finalidad de hacer cálculos o transformaciones de sus datos en tiempo real.
  // Recordar que estas propiedades tambien forman parte de nuestro modelo, y son recalculadas en el momento que alguno de sus datos dependientes cambia
  computed: {
    notePreview() {
      // La propiedad computada retorna el contenido parseado de la nota seleccionada en la vista, en caso contrario, retorna vacio
      return this.selectedNote ? marked(this.selectedNote.content) : ''
    },
    addButtonTitle() {
      return this.notes.length ? this.notes.length + ' notas añadidas' : '0 notas añadidas'
    },
    selectedNote() {
      // Retornamos la nota cuyo id sea identico al id de la nota seleccionada en la vista, en caso contrario retorno un objeto preconstruido con la data de mi modelo
      return this.notes.find(note => note.id === this.selectedId) // || { content: this.content }
    },
    sortedNotes() {
      // Retorno una copia del arreglo notes debidamente ordenado.
      // sort muta el arreglo original, lo que ocasiona que se desaten nuestros observadores. Por ello se decide crear una copia del mismo
      return this.notes.slice()
        // ordeno de menor a mayor, 
        // si el resultado de la resta es negativo, a va primero que b, en caso contrario, b va antes de a
        .sort((a, b) => a.created - b.created)
        // si a y b son favoritos no imparta el orden (0)
        // si a es favorito, entonces a va primero (-1)
        // si b es favorito, entonces a va despues de b (1) 
        .sort((a, b) => (a.favorite === b.favorite) ? 0 : a.favorite ? -1 : 1)
    },
    charactersCount() {
      if (this.selectedNote) {
        // Devolver la cantidad de caracteres encontrados en la propiedad content. Como es una cadena extensa, la dividimos en caracteres independientes, lo que genera un arreglo, posteriormetne procedemos a contar la longitud del mismo
        return this.selectedNote.content.split('').length
      }
    },
    linesCount() {
      if (this.selectedNote) {
        // Devolvemos el numero de nuevas lineas (renglones) de caracteres. Para ello dividimos la cadena a partir de la presencia de caractes de salto de linea (\r\n), o en algunos sistemas operativos lo presentan como (\n), o (\r). Esto nos genera un nuevo arreglo y procedemos a calcular su longitud (numero de renglones) 
        // Para ello nos auxiliamos de expresiones regulares
        return this.selectedNote.content.split(/\r\n|\r|\n/).length
      }
    },
    wordsCount() {
      if (this.selectedNote) {
        let s = this.selectedNote.content
        // Convertir caracteres de salto de linea en espacios en blanco
        s = s.replace(/\n/g, ' ')
        // Excluir espacios en blanco que aparecen al inicio y al final de cada linea
        s = s.replace(/(^\s)|(\s*$)/gi, '')
        // Convertir 2 o mas espacios seguidos en 1 solo
        s = s.replace(/\s\s+/gi, ' ')
        // Dividir la cadena resultante con base en los espacios en blanco para saber cuantas palabras hay. 
        return s.split(' ').length
      }
    }
  },
  // Los observadores ejecutan una funcion asociada a una propiedad cuando esta última cambia su valor. Es posible pasar un objeto para establecer opciones de ejecución y monitoreo de profundidad en los datos a observar, sin embargo, la mayoría del tiempo no hace falta especificar opciones adicionales.
  watch: {
    notes: {
      handler: 'saveNotes',
      // Necesitamos observar profundamente los cambios en las propiedades de cada objeto almacenado en el modelo de tipo arreglo notes

      // Por defecto solo se observan cambios de asignacion de valores simples, así como de agregar-remover-ordenar elementos de un arreglo. Pero no asignación de valores en atributos de objetos simples y anidados, ni mucho menos cambios en los valores de los elementos de un array 
      deep: true,
    },
    selectedId(newVal) {
      // guardar el id de la ultima nota seleccionada. La intensión es que si se recarga la app, se debe mostrar tal y como se dejó con la misma nota seleccionada
      localStorage.setItem('selected-id', newVal)
    }
  },
})