---
id: diagrama-de-violin
titulo: Diagrama de violín
titulo_en: Violin plot
alias:
  - gráfico de violín
  - violin plot
modulo: 4
submodulo: '4.6'
orden: 4
nivel: basico
prerrequisitos:
  - diagrama-de-caja
  - grafico-de-densidad
etiquetas:
  - visualización
  - densidad
  - comparación de grupos
  - forma de la distribución
resumen: >
  El diagrama de violín dibuja para cada grupo su densidad estimada en espejo, a veces con una caja
  dentro. Muestra la forma completa de la distribución, incluidos varios picos, que la caja oculta.
formula: '\text{ancho}(x) \propto \hat{f}_h(x) = \frac{1}{n h}\sum_{i=1}^{n} K\!\left(\frac{x - x_i}{h}\right)'
visualizacion:
  componente: ChartGallery
  parametros:
    grafico: cajas
    violin: true
    grupos:
      - nombre: Turno matutino
        forma: normal
        centro: 34
        escala: 4
        n: 120
      - nombre: Turno vespertino
        forma: mezcla
        parametro: 4.5
        centro: 36
        escala: 3
        n: 120
      - nombre: Turno nocturno
        forma: sesgo-derecha
        parametro: 3
        centro: 38
        escala: 5
        n: 120
    eje:
      variable: Tiempo de ensamble
      unidad: min
referencias:
  - clave: tufte
publicado: true
---

## Intuición

En una fábrica, el tiempo de ensamble del turno vespertino tiene casi la misma mediana y la misma caja que el del matutino. Un diagrama de caja diría que los dos turnos son parecidos. Sin embargo, el vespertino mezcla dos tipos de trabajadores, los nuevos y los experimentados, y sus tiempos forman dos montones separados con un hueco en medio. La caja no tiene forma de mostrar ese hueco.

El **diagrama de violín** sí lo muestra. Para cada grupo dibuja una curva de densidad, que es alta donde hay muchos datos y baja donde hay pocos, y la refleja como en un espejo, lo que le da su forma de violín. Dos jorobas en el violín son dos picos en los datos. Suele llevar dentro una caja delgada para conservar las referencias de mediana y cuartiles. Es la opción adecuada cuando se comparan grupos y la forma importa tanto como el centro.

## Definición

:::definicion[Diagrama de violín]
Para cada grupo se calcula una estimación de densidad $\hat{f}_h(x)$ con un núcleo $K$ y un ancho de banda $h$. Sobre un eje común, el violín es la región simétrica de ancho proporcional a $\hat{f}_h(x)$ en cada valor $x$, entre el mínimo y el máximo del grupo. Opcionalmente se superpone un diagrama de caja.
:::

Todos los violines se escalan de modo que su ancho máximo sea el mismo, o bien en proporción al número de datos; la elección cambia la lectura y conviene indicarla. En esta visualización, cada violín tiene el mismo ancho máximo.

:::figura[Un violín bimodal frente a uno unimodal: estaturas de estudiantes de un grupo mixto y de un equipo de baloncesto. La caja del grupo mixto se ve normal; el violín revela las dos jorobas.]{componente="ChartGallery"}
```yaml
grafico: cajas
violin: true
grupos:
  - nombre: Grupo mixto
    forma: mezcla
    parametro: 4
    centro: 166
    escala: 5
    n: 150
  - nombre: Equipo de baloncesto
    forma: normal
    centro: 188
    escala: 6
    n: 60
eje:
  variable: Estatura
  unidad: cm
```
:::

:::nota[Qué significa cada símbolo]
- $\hat{f}_h(x)$: densidad estimada del grupo en el valor $x$.
- $K$: núcleo, la función que reparte cada dato alrededor de su valor.
- $h$: ancho de banda, la suavidad de la estimación.
- $x_i$: datos del grupo; $n$: número de datos.
- $\propto$: "proporcional a".
:::

## Cómo usar la visualización

Tres turnos con 120 ensambles cada uno. La reproducción muestra primero los puntos, después las cajas y al final los violines. Cada violín es la densidad estimada del turno reflejada a ambos lados de la línea central.

El turno matutino tiene un violín de una sola joroba; el vespertino, dos jorobas separadas aunque su caja se parece a la del matutino; el nocturno, un violín con la parte ancha a la izquierda y una cola larga a la derecha. En la etapa de cajas los tres turnos parecen variaciones de lo mismo; en la etapa de violines aparecen tres formas distintas.

## Ejemplo

Un laboratorio mide la glucosa de 10 personas en ayunas: 82, 85, 86, 88, 90, 118, 121, 123, 125, 128 mg/dL.

1. Resumen: mínimo 82, $Q_1 \approx 86.5$, mediana $(90 + 118)/2 = 104$, $Q_3 \approx 122.5$, máximo 128.
2. La caja va de 86.5 a 122.5 con la mediana a la mitad: parece una distribución simétrica y ancha.
3. Pero ningún dato está entre 90 y 118. La mediana, 104, es un valor que nadie tiene.
4. El violín muestra dos jorobas, una cerca de 86 y otra cerca de 123, que corresponden a dos grupos de personas, quizá con y sin un trastorno metabólico.

:::figura[Las diez mediciones de glucosa del ejemplo: la caja sugiere simetría y el violín muestra el hueco central.]{componente="ChartGallery"}
```yaml
grafico: cajas
violin: true
puntos: true
grupos:
  - nombre: Pacientes
    valores: [82, 85, 86, 88, 90, 118, 121, 123, 125, 128]
eje:
  variable: Glucosa en ayunas
  unidad: mg/dL
```
:::

## Propiedades

- **Muestra la forma completa**, incluidos picos múltiples, asimetría y colas.
- **Depende del ancho de banda:** como toda densidad estimada, un ancho pequeño produce ondas falsas y uno grande borra picos reales.
- **Extiende la densidad más allá de los datos:** sin recorte, el violín puede asignar ancho a valores imposibles, como tiempos negativos; por eso se recorta al rango observado.
- **Compara mejor la forma que el centro:** para leer medianas y cuartiles exactos, la caja interior es más precisa.

:::figura[Propiedad de la forma: dos sucursales con medianas de ventas diarias parecidas. Una tiene ventas concentradas y la otra muy dispersas con cola a la derecha.]{componente="ChartGallery"}
```yaml
grafico: cajas
violin: true
grupos:
  - nombre: Sucursal estable
    forma: normal
    centro: 50
    escala: 4
    n: 100
  - nombre: Sucursal variable
    forma: sesgo-derecha
    parametro: 2
    centro: 55
    escala: 15
    n: 100
eje:
  variable: Ventas diarias
  unidad: miles de pesos
```
:::

## Errores comunes

- **Dibujar violines con muy pocos datos.** Con 8 o 10 datos, la forma depende casi por completo del ancho de banda; es mejor mostrar los puntos.
- **Leer el ancho como número de datos.** Si todos los violines tienen el mismo ancho máximo, un grupo de 20 datos y uno de 2000 se ven igual de llenos.
- **Interpretar las colas suavizadas como datos.** Las puntas del violín son efecto del núcleo, no observaciones.

:::figura[Pocos datos: seis mediciones de una variable. El violín dibuja una forma suave que los seis puntos no justifican.]{componente="ChartGallery"}
```yaml
grafico: cajas
violin: true
puntos: true
grupos:
  - nombre: Muestra pequeña
    valores: [12, 14, 15, 19, 20, 27]
eje:
  variable: Concentración
  unidad: mg/L
```
:::

## Conexiones

El violín combina el [[diagrama-de-caja]] con el [[grafico-de-densidad]], y comparte con este la dependencia del ancho de banda. Hace visible la [[multimodalidad]] que la caja oculta. El [[grafico-ridgeline]] es otra forma de comparar las densidades de muchos grupos.

## Formulario

:::formula[Ancho del violín]
$$
\text{ancho}(x) \propto \hat{f}_h(x)
$$

- $\hat{f}_h(x)$: densidad estimada del grupo.
:::

:::formula[Estimación de densidad por núcleos]
$$
\hat{f}_h(x) = \frac{1}{n h}\sum_{i=1}^{n} K\!\left(\frac{x - x_i}{h}\right)
$$

- $K$: núcleo; $h$: ancho de banda; $x_i$: datos; $n$: número de datos.
:::
