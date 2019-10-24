new Vue({
  el: '#notebook',
  data() {
    return {
      content: 'Escribe tu nota en **markdown**',
    }
  },
  // Las propiedades computadas son nuevas propiedades que combinan cualquier cantidad de propiedades de nuestro modelo, con la finalidad de hacer cálculos o transformaciones de sus datos en tiempo real.
  computed: {
    notePreview() {
      // La propiedad computada retorna el contenido del modelo content (Markdown) parseado a HTML
      return marked(this.content)
    }
  },
  // Los observadores ejecutan una funcion asociada a una propiedad cuando esta última cambia su valor. Es posible pasar un objeto para establecer opciones de ejecución y monitoreo de profundidad en los datos a observar, sin embargo, la mayoría del tiempo no hace falta especificar opciones adicionales.
  watch: {
    content(newVal, oldVal) {
      console.log('Nuevo valor:', newVal, 'Valor anterior:', oldVal)
      // Guardamos la nota justo en el momento que se le realiza un determinado cambio de contenido.
      localStorage.setItem('content', newVal)
    }
    /*
    content: {
      handler(newVal, oldVal) {
        console.log('nueva nota:', newVal, 'nota anterior:', oldVal)
      },
      immediate: true,  // Ejecutar el observador tan pronto como se cree el componente (default false)
      deep: false,  // Revisar recursivamete cambios en objetos anidados (default false)
    }
    */
  }
})