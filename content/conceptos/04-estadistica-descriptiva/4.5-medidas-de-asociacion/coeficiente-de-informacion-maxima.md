---
id: coeficiente-de-informacion-maxima
titulo: Coeficiente de información máxima (MIC)
titulo_en: Maximal information coefficient
alias:
  - MIC
  - información máxima
modulo: 4
submodulo: '4.5'
orden: 14
nivel: avanzado
prerrequisitos:
  - informacion-mutua-empirica
  - cuantiles-cuartiles-deciles-y-percentiles
relaciones:
  - tipo: relacionado
    id: correlacion-de-distancia
etiquetas:
  - asociación
  - información mutua
  - dependencia no lineal
  - mallas
resumen: >
  El MIC busca, entre muchas mallas que dividen el diagrama de dispersión, la que da la mayor
  información mutua normalizada. Toma valores de 0 a 1 y detecta relaciones de formas muy variadas.
formula: '\mathrm{MIC} = \max_{a\,b < B(n)} \frac{\hat{I}_{a \times b}^{*}}{\log \min(a, b)}'
visualizacion:
  componente: AssociationViz
  parametros:
    modo: mic
    generador:
      tipo: senoidal
      n: 80
      ruido: 0.15
    nombres:
      x: Hora del día
      y: Demanda de electricidad
referencias:
  - clave: cover-thomas
  - clave: murphy
publicado: true
---

## Intuición

La demanda de electricidad de una ciudad sube y baja a lo largo del día con dos picos, uno en la mañana y otro en la noche. La relación entre la hora y la demanda es fuerte, pero ni es lineal ni es monótona, así que Pearson y Spearman la subestiman. Una manera de detectar cualquier relación es cuadricular el diagrama de dispersión y contar cuántos puntos caen en cada cuadro. Si las variables son independientes, los puntos se reparten de forma pareja por toda la cuadrícula; si están relacionados, se concentran en algunos cuadros.

La información mutua de esa tabla de conteos mide qué tan concentrados están. El problema es elegir la cuadrícula: muy gruesa no ve la forma, muy fina tiene un cuadro por punto. El **coeficiente de información máxima** prueba muchas cuadrículas de distintas resoluciones, normaliza la información mutua de cada una para que quede entre 0 y 1, y se queda con la mayor. Fue propuesto en 2011 por Reshef y colaboradores para explorar conjuntos con muchas parejas de variables.

## Definición

:::definicion[Coeficiente de información máxima]
Para una malla $G$ de $a$ columnas y $b$ filas sobre el diagrama de dispersión, sea $\hat{I}_G$ la información mutua de la tabla de conteos que produce. Sea $\hat{I}^{*}_{a \times b}$ el máximo de $\hat{I}_G$ sobre todas las mallas de $a \times b$ celdas. El MIC es
$$
\mathrm{MIC} = \max_{a\,b < B(n)} \frac{\hat{I}^{*}_{a \times b}}{\log \min(a, b)},
$$
donde $B(n)$ limita el tamaño de la malla; el valor usual es $B(n) = n^{0.6}$.
:::

El cociente entre $\log \min(a, b)$ normaliza, porque esa es la mayor información mutua posible en una malla de $a \times b$. La visualización usa una versión simplificada: en cada malla, los cortes se colocan en los cuantiles de cada variable (frecuencias iguales), en lugar de optimizar su posición como en el algoritmo original; el resultado es una aproximación por debajo del MIC.

:::figura[Una relación con un salto: rendimiento de un motor que cambia de régimen a cierta velocidad. Una malla de 2 por 2 ya captura casi toda la dependencia.]{componente="AssociationViz"}
```yaml
modo: mic
generador:
  tipo: escalon
  n: 60
  ruido: 0.2
nombres:
  x: Velocidad del motor
  y: Rendimiento
```
:::

:::nota[Qué significa cada símbolo]
- $\mathrm{MIC}$: coeficiente de información máxima, entre 0 y 1.
- $a$, $b$: número de columnas y de filas de una malla.
- $G$: una malla concreta; $\hat{I}_G$: información mutua de su tabla de conteos.
- $\hat{I}^{*}_{a \times b}$: mayor información mutua entre las mallas de $a \times b$.
- $\log \min(a, b)$: información mutua máxima posible en esa malla.
- $B(n)$: límite al número de celdas, que crece con el tamaño de muestra $n$.
:::

## Cómo usar la visualización

Los 80 puntos relacionan la hora con la demanda. La reproducción prueba una malla tras otra, de 2 por 2 hacia resoluciones mayores, dibujando los cortes en los cuantiles de cada eje. El encabezado muestra la información mutua de la malla actual, su normalización y el mejor puntaje encontrado hasta el momento.

Las mallas pequeñas no capturan los dos picos y dan puntajes bajos; las que tienen suficientes columnas para separar las subidas y bajadas dan puntajes mucho mayores. Al final se dibuja la mejor malla. El panel compara el resultado con Pearson y con la correlación de distancia, que son menores para esta forma.

## Ejemplo

Veinte puntos sobre una recta creciente, sin ruido: $(1, 1), (2, 2), \dots, (20, 20)$.

1. Malla de 2 por 2 con cortes en las medianas (10.5 en ambos ejes): los 10 puntos con $x \le 10$ tienen $y \le 10$, y los otros 10 tienen $y > 10$.
2. Tabla de conteos: $\begin{pmatrix} 10 & 0 \\ 0 & 10 \end{pmatrix}$, con proporciones $0.5, 0, 0, 0.5$ y marginales de $0.5$.
3. Información mutua: $2 \cdot 0.5\log\frac{0.5}{0.25} = \log 2$.
4. Normalización: $\log 2 / \log \min(2, 2) = 1$. Ya con la primera malla se alcanza el máximo posible, y $\mathrm{MIC} = 1$.

:::figura[Veinte puntos sobre una recta sin ruido, como en el ejemplo: las mallas de frecuencias iguales dan puntajes iguales o muy cercanos a 1.]{componente="AssociationViz"}
```yaml
modo: mic
generador:
  tipo: lineal
  n: 20
  ruido: 0
nombres:
  x: Peso en la báscula A
  y: Peso en la báscula B
```
:::

## Propiedades

- **Rango:** $0 \le \mathrm{MIC} \le 1$.
- **Relaciones funcionales sin ruido** dan valores cercanos a 1, sin importar su forma (lineal, exponencial, periódica).
- **Equitatividad buscada:** con el mismo nivel de ruido, relaciones de formas distintas tienden a dar valores parecidos; esta propiedad se cumple solo de forma aproximada.
- **Simetría:** $\mathrm{MIC}(x, y) = \mathrm{MIC}(y, x)$.
- **Costo y sesgo:** explorar muchas mallas es costoso, y con pocos datos el máximo sobre muchas mallas sesga el valor hacia arriba.

:::figura[Relación funcional en anillo: puntos sobre una circunferencia con poco ruido. No es una función de x, pero las mallas finas capturan la dependencia y el puntaje es alto.]{componente="AssociationViz"}
```yaml
modo: mic
generador:
  tipo: circulo
  n: 100
  ruido: 0.15
nombres:
  x: Coordenada x
  y: Coordenada y
```
:::

## Errores comunes

- **Interpretarlo como una correlación.** El MIC no tiene signo ni se relaciona de forma simple con $r$; un MIC de 0.5 no significa lo mismo que $r = 0.5$.
- **Ignorar el sesgo con pocos datos.** Con 30 puntos independientes, el máximo sobre varias mallas puede dar valores de 0.2 a 0.4.
- **Suponer que es mejor que otras medidas en todo caso.** Para relaciones lineales con ruido, Pearson y la correlación de distancia detectan la asociación con menos datos.

:::figura[Sesgo con pocos datos: 30 pares independientes. La mejor malla encuentra algo de información mutua por azar.]{componente="AssociationViz"}
```yaml
modo: mic
generador:
  tipo: independiente
  n: 30
nombres:
  x: Variable A
  y: Variable B
```
:::

## Conexiones

El MIC maximiza la [[informacion-mutua-empirica]] sobre mallas cuyos cortes, en la versión simplificada, son [[cuantiles-cuartiles-deciles-y-percentiles|cuantiles]] de cada variable. Comparte con la [[correlacion-de-distancia]] el objetivo de detectar dependencias de cualquier forma. Su uso principal es explorar muchas parejas de variables en busca de relaciones que no son lineales.

## Formulario

:::formula[Coeficiente de información máxima]
$$
\mathrm{MIC} = \max_{a\,b < B(n)} \frac{\hat{I}^{*}_{a \times b}}{\log \min(a, b)}
$$

- $a$, $b$: columnas y filas de la malla.
- $\hat{I}^{*}_{a \times b}$: máxima información mutua con ese tamaño de malla.
- $B(n)$: límite del tamaño de malla.
:::

:::formula[Límite usual de la malla]
$$
B(n) = n^{0.6}
$$

- $n$: número de puntos.
:::

:::formula[Información mutua de una malla]
$$
\hat{I}_G = \sum_{i,j}\hat{p}_{ij}\log\frac{\hat{p}_{ij}}{\hat{p}_{i\cdot}\,\hat{p}_{\cdot j}}
$$

- $\hat{p}_{ij}$: proporción de puntos en la celda $(i, j)$ de la malla.
:::
