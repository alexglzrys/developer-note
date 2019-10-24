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
    }
  },
  // Las propiedades computadas son nuevas propiedades que combinan cualquier cantidad de propiedades de nuestro modelo, con la finalidad de hacer cálculos o transformaciones de sus datos en tiempo real.
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