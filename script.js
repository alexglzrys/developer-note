new Vue({
  el: '#notebook',
  data() {
    return {
      content: 'Escribe tu nota en **markdown**',
      notes: [],
    }
  },
  // Los métodos son funciones reutilizables dentro de nuestra aplicación de Vuejs. Los cuales pueden ser invocados por medio de acciones en la vista de nuestra aplicación, por otros métodos, u observadores.
  methods: {
    saveNote(val, oldVal) {
      console.log('Cambios guardados exitosamente:', val, 'antes', oldVal)
      localStorage.setItem('content', val)
      // Podemos acceder a propiedades y metodos de la instancia de Vue a través de la palabra clave this
      this.reportOperation('saving')
    },
    reportOperation(name) {
      console.log('La operación', name, 'se completó exitosamente')
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
    }
  },
  // Las propiedades computadas son nuevas propiedades que combinan cualquier cantidad de propiedades de nuestro modelo, con la finalidad de hacer cálculos o transformaciones de sus datos en tiempo real.
  computed: {
    notePreview() {
      // La propiedad computada retorna el contenido del modelo content (Markdown) parseado a HTML
      return marked(this.content)
    },
    addButtonTitle() {
      return this.notes.length ? this.notes.length + ' notas añadidas' : '0 notas añadidas'
    }
  },
  // Los observadores ejecutan una funcion asociada a una propiedad cuando esta última cambia su valor. Es posible pasar un objeto para establecer opciones de ejecución y monitoreo de profundidad en los datos a observar, sin embargo, la mayoría del tiempo no hace falta especificar opciones adicionales.
  watch: {
    // En este caso, cuando sucede un cambio en el modelo content, se invoca el método saveNote. De forma implicita se mandan los parametros newVal y oldVal
    content: 'saveNote'
  },
  // Gancho del ciclo de vida de los componentes de Vue, este se llama justo cuando la instancia de vue esta lista, es decir, se haya creado. (sin embargo el componente aun no esta montado ni renderizado en el DOM) - Este mecanismo nos permite cargar la nota nuevamente cuando se refresca la aplicación
  created() {
    // Recuperamos el contenido almacenado en localStorage para mostrar la nota guardada en la aplicación, en caso contrario, mostramos una cadena por defecto.
    // Esto ocasiona que nuestro observer se ejecute, dado que Vue en primer lugar carga la data declarada en el modelo, y este gancho hace que se modifique parte del modelo.
    this.content = localStorage.getItem('content') || 'Tu puedes escribir en **markdown**'
  }
})