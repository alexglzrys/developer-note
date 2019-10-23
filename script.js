new Vue({
  el: '#notebook',
  data() {
    return {
      content: 'Escribe tu nota en **markdown**',
    }
  },
  // Las propiedades computadas son nuevas propiedades que combinan cualquier cantidad de propiedades de nuestro modelo, con la finalidad de hacer cálculos o transformaciones de sus datos en tiempo real.

  // Los calculos son almacenados en caché para su posterior uso, y solo se vuelven a calcular si alguna de las propiedades que interviene en el calculo cambia.

  // Finalmente, una propiedad computada se puede usar como cualquier propiedad decladara en el objeto o función data. asi como usarse dentro de otras propiedades computadas
  computed: {
    notePreview() {
      // La propiedad computada retorna el contenido del modelo content (Markdown) parseado a HTML
      return marked(this.content)
    }
  }
})