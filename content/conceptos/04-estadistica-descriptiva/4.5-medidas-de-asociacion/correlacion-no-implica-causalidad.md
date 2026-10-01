---
id: correlacion-no-implica-causalidad
titulo: Correlación no implica causalidad
titulo_en: Correlation does not imply causation
alias:
  - correlación y causalidad
  - variable de confusión
  - tercera variable
modulo: 4
submodulo: '4.5'
orden: 5
nivel: basico
prerrequisitos:
  - coeficiente-de-correlacion-de-pearson
etiquetas:
  - causalidad
  - confusión
  - causalidad inversa
  - sesgo de selección
resumen: >
  Que dos variables estén correlacionadas no prueba que una cause a la otra: la asociación puede venir
  de una causa común, de la causalidad inversa, de la forma de seleccionar los datos o del azar.
formula: 'r_{xy} \neq 0 \;\not\Rightarrow\; X \to Y'
visualizacion:
  componente: AssociationViz
  parametros:
    modo: confusor
    vista: grupos
    nombres:
      x: Helados vendidos (cientos)
      y: Golpes de calor atendidos
      z: Mes
    niveles: [Enero, Abril, Julio]
    n: 90
    efectoX: 3
    efectoY: 3
    origen: [5, 3]
referencias:
  - clave: pearl
    capitulo: '1'
  - clave: hernan-robins
publicado: true
---

## Intuición

En una ciudad, los días en que se venden más helados también son los días en que más personas llegan a urgencias por golpe de calor. La correlación es fuerte y no es casualidad, pero nadie propondría prohibir los helados para evitar los golpes de calor. Ambas cosas suben por la misma razón: hace calor. La temperatura es una **causa común** que mueve a las dos variables a la vez.

Cuando se observa una correlación entre $X$ y $Y$ hay varias explicaciones posibles además de "$X$ causa $Y$": que $Y$ cause $X$ (causalidad inversa), que una tercera variable cause ambas (confusión), que la forma de elegir los datos haya creado la asociación (selección), o que sea simple coincidencia. Los datos observacionales por sí solos no distinguen entre estas explicaciones. Para hablar de causas hace falta un experimento con asignación aleatoria o un análisis que haga explícitos los supuestos sobre qué causa qué.

## Definición

:::definicion[Asociación y causalidad]
Dos variables están **asociadas** si conocer el valor de una cambia la distribución de la otra; la correlación $r_{xy}$ mide la parte lineal de esa asociación. $X$ **causa** $Y$ si intervenir para cambiar $X$, manteniendo todo lo demás, cambia $Y$. Una correlación distinta de cero es compatible con cualquiera de estas estructuras:

1. $X \to Y$: causalidad directa.
2. $Y \to X$: causalidad inversa.
3. $X \leftarrow Z \rightarrow Y$: una causa común $Z$, llamada variable de **confusión**.
4. Selección de la muestra según una consecuencia de $X$ y de $Y$.
5. Azar, especialmente cuando se examinan muchas parejas de variables.
:::

:::figura[Causa común más efecto directo: horas de práctica y puntaje en una prueba de mecanografía, en grupos de distinto nivel inicial. Dentro de cada nivel queda una relación positiva, porque la práctica sí mejora el puntaje, pero mucho más débil que la correlación total.]{componente="AssociationViz"}
```yaml
modo: confusor
vista: grupos
nombres:
  x: Horas de práctica
  y: Palabras por minuto
  z: Nivel inicial
niveles: [Bajo, Medio, Alto]
n: 90
efectoX: 4
efectoY: 12
directo: 1.5
ruido: 1.5
origen: [3, 25]
```
:::

:::nota[Qué significa cada símbolo]
- $r_{xy}$: correlación entre $X$ y $Y$.
- $X \to Y$: "$X$ causa $Y$".
- $X \leftarrow Z \rightarrow Y$: $Z$ causa a $X$ y a $Y$.
- $Z$: variable de confusión, causa común.
- $\not\Rightarrow$: "no implica".
:::

## Cómo usar la visualización

Cada punto es un día. Primero aparecen todos los días juntos y el encabezado muestra una correlación alta entre helados y golpes de calor. Después los puntos se colorean según el mes, y al final se dibuja una recta dentro de cada mes con su propia correlación.

Dentro de cada mes, la correlación es cercana a cero: entre días con temperaturas parecidas, vender más helados no se asocia con más golpes de calor. La correlación total viene de que los tres grupos están en lugares distintos del plano. Al cambiar la semilla los datos cambian, pero el patrón se mantiene.

## Ejemplo

En 40 incendios de una ciudad se registra cuántos bomberos acudieron y el monto de los daños. La correlación es de 0.8: los incendios con más bomberos tuvieron más daños.

1. Explicación ingenua: los bomberos causan daños. Es falsa.
2. Causa común: el tamaño del incendio. Un incendio grande provoca que se envíen más bomberos y también provoca más daños.
3. Si se comparan solo incendios de tamaño parecido, por ejemplo los que afectaron un solo cuarto, la correlación desaparece o se vuelve negativa: con más bomberos, el fuego se controla antes.
4. Conclusión: para estimar el efecto de enviar más bomberos hay que comparar incendios con el mismo tamaño inicial, o mejor aún, asignar el número de bomberos al azar, lo cual no es ético; por eso se usan métodos de inferencia causal con datos observacionales.

:::figura[El ejemplo de los incendios con el tamaño como causa común: dentro de cada tamaño, más bomberos se asocia con menos daño.]{componente="AssociationViz"}
```yaml
modo: confusor
vista: grupos
nombres:
  x: Bomberos enviados
  y: Daños (millones de pesos)
  z: Tamaño del incendio
niveles: [Pequeño, Mediano, Grande]
n: 60
efectoX: 6
efectoY: 4
directo: -0.4
ruido: 1.2
origen: [4, 2]
```
:::

## Propiedades

- **La confusión puede crear, ocultar o invertir una asociación.** Dependiendo de los efectos de la causa común, la correlación total puede ser más fuerte, más débil o de signo opuesto a la relación dentro de los grupos.
- **Controlar por la causa común** (comparar dentro de sus niveles, o eliminar su efecto con la correlación parcial) quita la parte de la asociación que ella produce, si se conoce y se mide bien.
- **Los experimentos aleatorizados** rompen la relación entre $X$ y cualquier causa común, porque el investigador asigna $X$ al azar.
- **La dirección no se ve en los datos:** $r_{xy} = r_{yx}$, así que el coeficiente no puede indicar qué variable es la causa.

:::figura[Controlar por la causa común: los mismos días de verano después de quitar el efecto lineal del mes. Lo que queda es la correlación parcial, cercana a cero.]{componente="AssociationViz"}
```yaml
modo: confusor
vista: residuos
nombres:
  x: Helados vendidos
  y: Golpes de calor
  z: Mes
niveles: [Enero, Abril, Julio]
n: 90
efectoX: 3
efectoY: 3
origen: [5, 3]
```
:::

## Errores comunes

- **Recomendar una intervención a partir de una correlación.** "Los estudiantes que desayunan sacan mejores calificaciones, así que hay que hacerlos desayunar" ignora que el desayuno se asocia con otros factores del hogar.
- **Creer que controlar por más variables siempre ayuda.** Controlar por una consecuencia común de $X$ y $Y$ crea asociaciones falsas; las variables a controlar se eligen con un modelo causal.
- **Pensar que una correlación débil descarta un efecto.** Una causa común puede ocultar un efecto real e incluso invertir su signo.

:::figura[Un efecto oculto: dentro de cada grupo de edad, más ejercicio se asocia con menor presión arterial, pero los grupos de mayor edad hacen más ejercicio por indicación médica y tienen presión más alta, así que la correlación total sale positiva.]{componente="AssociationViz"}
```yaml
modo: confusor
vista: grupos
nombres:
  x: Horas de ejercicio a la semana
  y: Presión sistólica
  z: Grupo de edad
niveles: [30 a 44, 45 a 59, 60 o más]
n: 90
efectoX: 2
efectoY: 12
directo: -2
ruido: 1
origen: [2, 115]
```
:::

## Conexiones

La correlación que se discute aquí es el [[coeficiente-de-correlacion-de-pearson]] o cualquier otra medida de asociación. El efecto de una causa común se cuantifica con la [[correlacion-parcial]], y la asociación sin ninguna relación de fondo es la [[correlacion-espuria]]. La inferencia causal estudia formalmente estas estructuras con grafos dirigidos y experimentos.

## Formulario

:::formula[Correlación sin implicación causal]
$$
r_{xy} \neq 0 \;\not\Rightarrow\; X \to Y
$$

- $r_{xy}$: correlación observada.
- $X \to Y$: efecto causal de $X$ sobre $Y$.
:::

:::formula[Estructura de confusión]
$$
X \leftarrow Z \rightarrow Y
$$

- $Z$: causa común de $X$ y de $Y$.
:::
