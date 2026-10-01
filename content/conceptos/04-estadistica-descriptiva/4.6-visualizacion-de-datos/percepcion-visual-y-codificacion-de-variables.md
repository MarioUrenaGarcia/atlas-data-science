---
id: percepcion-visual-y-codificacion-de-variables
titulo: Percepción visual y codificación de variables (posición, longitud, color, área)
titulo_en: Visual perception and encoding of variables
alias:
  - canales visuales
  - codificación visual
  - jerarquía de Cleveland y McGill
  - ley de Stevens
modulo: 4
submodulo: '4.6'
orden: 26
nivel: basico
prerrequisitos:
  - grafico-de-pastel-y-sus-limitaciones
etiquetas:
  - visualización
  - percepción
  - canales visuales
  - diseño
resumen: >
  Cada gráfico codifica números con canales visuales: posición, longitud, ángulo, área o color. Las
  personas comparan con más precisión posiciones y longitudes que ángulos, áreas o intensidades de
  color, y eso guía qué canal usar.
formula: '\text{percibido} \propto (\text{estímulo})^{\beta},\qquad \beta_{\text{longitud}} \approx 1,\ \beta_{\text{área}} \approx 0.7'
visualizacion:
  componente: ChartGallery
  parametros:
    grafico: percepcion
    a: 30
    b: 80
referencias:
  - clave: tufte
  - clave: murphy
publicado: true
---

## Intuición

El mismo par de números, 45 y 75, puede dibujarse de muchas maneras: dos puntos a distinta altura sobre una escala común, dos barras, dos ángulos, dos círculos o dos cuadros de distinta intensidad de color. Si se pregunta "¿qué fracción del mayor es el menor?", las respuestas son muy distintas según el dibujo. Con los puntos o las barras casi todos responden cerca de 60 %; con los círculos muchos dicen 70 % o más; con los colores las respuestas se dispersan mucho.

Cada forma de dibujar un número es un **canal visual**. En 1984, William Cleveland y Robert McGill midieron experimentalmente qué tan bien se juzgan las proporciones en cada canal y encontraron un orden: posición sobre una escala común, posición sobre escalas no alineadas, longitud, ángulo y pendiente, área, y al final volumen e intensidad del color. La ley de Stevens, de la psicofísica, explica parte del orden: la sensación de área crece más despacio que el área real, por lo que las diferencias de área se subestiman. La regla práctica es asignar la comparación más importante al canal más preciso.

## Definición

:::definicion[Canal visual y ley de potencias de Stevens]
Un **canal visual** es una propiedad gráfica (posición, longitud, ángulo, área, intensidad o tono del color, forma) que se hace variar para representar el valor de una variable. Para muchos canales, la magnitud percibida $\psi$ de un estímulo de intensidad $\phi$ sigue aproximadamente la **ley de potencias de Stevens**:

$$
\psi = k\,\phi^{\beta},
$$

de modo que una razón real $r = \phi_1/\phi_2$ se percibe como

$$
r_{\text{percibida}} = r^{\beta}.
$$

Con $\beta \approx 1$ (longitud) la percepción es casi fiel; con $\beta < 1$ (área, $\beta \approx 0.7$; volumen, $\beta \approx 0.6$) las diferencias se perciben menores de lo que son.
:::

Los exponentes son promedios experimentales y varían entre personas y tareas; el orden de Cleveland y McGill describe la precisión típica de juicios de proporción, no una ley exacta.

:::nota[Qué significa cada símbolo]
- $\psi$: magnitud percibida.
- $\phi$: magnitud física del estímulo (longitud, área).
- $k$: constante de proporcionalidad.
- $\beta$: exponente de Stevens del canal.
- $r$: razón real entre dos estímulos; $r_{\text{percibida}}$: razón que se percibe.
:::

## Cómo usar la visualización

Los dos valores A y B se dibujan con seis canales, que aparecen uno por uno en el orden de Cleveland y McGill. Con los valores ocultos, el encabezado plantea la pregunta: qué fracción del mayor es el menor.

Controles: **Valor A**, **Valor B** y **Mostrar los valores**, que revela los números, la razón verdadera y la razón que predice la ley de Stevens para el área.

Experimentos sugeridos:

1. Con los valores ocultos, estimar la razón en cada panel y anotarla; después mostrar los valores y comparar.
2. Poner A = 50 y B = 100: el círculo de B tiene el doble de área, pero se percibe como 1.6 veces la de A.
3. Poner A y B casi iguales (por ejemplo 70 y 74): en posición y longitud se distingue cuál es mayor; en color e intensidad, casi no.

## Ejemplo

Valores $A = 45$ y $B = 75$:

1. Razón verdadera: $45/75 = 0.60$.
2. Con longitudes ($\beta \approx 1$), la razón percibida es $0.60^{1} = 0.60$.
3. Con áreas ($\beta \approx 0.7$), $0.60^{0.7} = e^{0.7 \log 0.60} \approx e^{-0.358} \approx 0.70$: el círculo pequeño parece 70 % del grande.
4. Con volúmenes ($\beta \approx 0.6$), $0.60^{0.6} \approx 0.74$.

:::figura[Los valores del ejemplo, 45 y 75. Al activar Mostrar los valores se leen la razón verdadera, 0.60, y la percibida en área, 0.70.]{componente="ChartGallery"}
```yaml
grafico: percepcion
a: 45
b: 75
```
:::

## Propiedades

- **Jerarquía de precisión** (Cleveland y McGill): posición común, posición no alineada, longitud, ángulo y pendiente, área, volumen e intensidad de color.
- **Subestimación del área:** con $\beta < 1$, la razón percibida está más cerca de 1 que la real.
- **Canales para categorías:** el tono del color y la forma distinguen bien clases sin orden, pero no transmiten magnitudes.
- **Atributos preatentivos:** un tono o tamaño distinto destaca sin esfuerzo entre muchos elementos, útil para resaltar.

:::figura[Valores muy distintos, 20 y 90: incluso en los canales menos precisos se nota cuál es mayor, pero la magnitud de la diferencia solo se aprecia bien en posición y longitud.]{componente="ChartGallery"}
```yaml
grafico: percepcion
a: 20
b: 90
```
:::

:::figura[Área frente a altura: la misma producción que se duplica dibujada con una figura que crece solo en altura y con otra que crece en alto y ancho. La segunda cuadruplica el área y exagera el cambio.]{componente="ChartGallery"}
```yaml
grafico: enganoso
truco: pictograma
etiquetas: [Año 1, Año 2]
valores: [25, 50]
variable: Producción (miles de piezas)
```
:::

## Errores comunes

- **Codificar la variable principal con área o color.** Un mapa de burbujas o de colores es atractivo, pero la comparación de magnitudes se vuelve imprecisa.
- **Escalar el radio en lugar del área.** Si el radio de un círculo es proporcional al valor, el área crece con el cuadrado y el doble se ve como el cuádruple.
- **Usar el tono para cantidades.** Rojo, verde y azul no tienen un orden natural; para magnitudes se usa la luminosidad o intensidad.
- **Ignorar el contexto de comparación.** Dos barras alineadas sobre una base común se comparan mejor que dos barras en paneles distintos con escalas propias.

:::figura[Intensidad de color para una cantidad: rendimiento de un cultivo en una rejilla de parcelas. Las diferencias grandes se notan, pero estimar cuánto mayor es una parcela que otra es difícil sin los valores.]{componente="ChartGallery"}
```yaml
grafico: calor
filas: [Parcela 1, Parcela 2, Parcela 3, Parcela 4]
columnas: [Sur, Centro, Norte, Este]
valores:
  - [4.1, 4.6, 5.2, 4.4]
  - [3.8, 4.9, 5.6, 4.0]
  - [4.5, 5.1, 6.0, 4.7]
  - [3.6, 4.2, 4.8, 3.9]
paleta: secuencial
variable: Toneladas por hectárea
```
:::

## Conexiones

La jerarquía explica por qué el [[grafico-de-barras]] supera al [[grafico-de-pastel-y-sus-limitaciones|gráfico de pastel]], por qué el [[mapa-de-calor]] se usa para patrones y no para lecturas exactas, y por qué las figuras escaladas en dos dimensiones aparecen entre los [[graficos-enganosos]]. La elección de colores se desarrolla en [[uso-del-color-en-visualizacion]].

## Formulario

:::formula[Ley de potencias de Stevens]
$$
\psi = k\,\phi^{\beta}
$$

- $\psi$: magnitud percibida; $\phi$: magnitud física del estímulo.
- $k$: constante; $\beta$: exponente propio del canal.
:::

:::formula[Razón percibida]
$$
r_{\text{percibida}} = r^{\beta},\qquad r = \frac{\phi_1}{\phi_2}
$$

- $r$: razón real entre dos estímulos.
- $\beta$: exponente del canal, cerca de 1 para longitud, 0.7 para área y 0.6 para volumen.
:::

:::formula[Radio de un círculo con área proporcional al valor]
$$
\rho = R\sqrt{\frac{v}{v_{\max}}}
$$

- $\rho$: radio del círculo; $R$: radio del círculo del valor máximo.
- $v$: valor representado; $v_{\max}$: valor máximo.
:::
