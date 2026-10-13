---
id: matriz-de-diagramas-de-dispersion
titulo: Matriz de diagramas de dispersión
titulo_en: Scatter plot matrix
alias:
  - SPLOM
  - pairs plot
  - gráfico de pares
modulo: 4
submodulo: '4.6'
orden: 11
nivel: basico
prerrequisitos:
  - diagrama-de-dispersion
  - histograma
relaciones:
  - tipo: relacionado
    id: matriz-de-correlacion
etiquetas:
  - visualización
  - varias variables
  - pares de variables
  - exploración
resumen: >
  La matriz de diagramas de dispersión acomoda en una cuadrícula el diagrama de dispersión de cada par de
  variables, con la distribución de cada variable en la diagonal. Permite revisar de un vistazo todas
  las relaciones de a dos.
formula: '\text{celda } (j, k) = \{(x_{ik}, x_{ij}) : i = 1, \dots, n\},\quad j, k = 1, \dots, p'
visualizacion:
  componente: ChartGallery
  parametros:
    grafico: matriz-dispersion
    variables:
      - nombre: Peso (t)
        valores: [1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 2.0, 1.25, 1.55, 1.9, 1.15, 2.1]
      - nombre: Potencia (hp)
        valores: [70, 85, 95, 110, 120, 140, 150, 175, 190, 220, 90, 160, 170, 105, 260]
      - nombre: Rendimiento (km/L)
        valores:
          [18.5, 17.0, 15.8, 14.5, 13.6, 12.4, 11.6, 10.5, 9.8, 8.6, 16.4, 12.0, 9.4, 16.0, 8.0]
      - nombre: Aceleración (s)
        valores: [13.5, 12.5, 11.8, 10.9, 10.2, 9.1, 8.8, 7.9, 7.4, 6.8, 12.9, 8.3, 8.6, 10.8, 5.9]
    grupos: [0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 0, 1, 2, 0, 2]
    nombresGrupos: [Compacto, Sedán, Camioneta]
referencias:
  - clave: james-isl
    capitulo: '2'
  - clave: tufte
publicado: true
---

## Intuición

Una revista de automóviles mide cuatro características de 15 modelos: peso, potencia, rendimiento de combustible y tiempo de aceleración. Con cuatro variables hay seis pares posibles, y revisar seis diagramas de dispersión sueltos es incómodo. La solución es acomodarlos en una cuadrícula de 4 por 4: la fila indica qué variable va en el eje vertical y la columna cuál va en el horizontal. Así, toda la fila del rendimiento muestra cómo se relaciona el rendimiento con cada una de las demás.

La diagonal, donde una variable se cruzaría consigo misma, se aprovecha para dibujar su histograma. El resultado es una **matriz de diagramas de dispersión**: una vista panorámica que en segundos revela qué pares están muy relacionados, cuáles no, si alguna relación es curva y si hay grupos o atípicos. Es una de las primeras gráficas en un análisis con varias variables.

## Definición

:::definicion[Matriz de diagramas de dispersión]
Para $n$ observaciones de $p$ variables cuantitativas, con $x_{ij}$ el valor de la variable $j$ en la observación $i$, la **matriz de diagramas de dispersión** es una cuadrícula de $p \times p$ celdas en la que la celda de la fila $j$ y la columna $k$ contiene el diagrama de dispersión

$$
\{(x_{ik}, x_{ij}) : i = 1, \dots, n\},
$$

con la variable $k$ en el eje horizontal y la variable $j$ en el vertical. Las celdas de la diagonal ($j = k$) muestran la distribución de cada variable, por ejemplo con un histograma.
:::

Todas las celdas de una misma columna comparten escala horizontal y todas las de una misma fila comparten escala vertical, lo que permite comparar a lo largo de la cuadrícula.

:::nota[Qué significa cada símbolo]
- $n$: número de observaciones.
- $p$: número de variables.
- $x_{ij}$: valor de la variable $j$ en la observación $i$.
- $j$: índice de la fila (variable del eje vertical).
- $k$: índice de la columna (variable del eje horizontal).
:::

## Cómo usar la visualización

Las celdas se dibujan una por una, de izquierda a derecha y de arriba abajo; la celda en curso se resalta y el encabezado muestra su correlación de Pearson o indica que es un histograma de la diagonal. Los colores separan compactos, sedanes y camionetas.

Experimentos sugeridos:

1. Detener la animación en la celda de rendimiento contra peso y verificar que la correlación es fuertemente negativa.
2. Comparar esa celda con la de peso contra rendimiento: es la misma nube reflejada sobre la diagonal.
3. Observar que los tres tipos de vehículo forman bloques a lo largo de cada nube: el grupo explica buena parte de la variación.

## Ejemplo

Cuatro variables producen una matriz de $4 \times 4 = 16$ celdas:

1. Cuatro celdas en la diagonal, una por variable, con su histograma.
2. Las 12 restantes son diagramas de dispersión, pero solo $\binom{4}{2} = 6$ pares son distintos: la celda $(j, k)$ es la reflexión de la $(k, j)$.
3. En los datos de la revista, la celda de rendimiento contra potencia baja de izquierda a derecha con $r \approx -0.95$: más potencia, menos kilómetros por litro.
4. La celda de aceleración contra potencia también baja: los motores potentes tardan menos segundos en llegar a 100 km/h.

:::figura[Tres variables de 12 estudiantes (horas de estudio, horas de sueño, calificación): matriz de 3 por 3 con 3 pares distintos.]{componente="ChartGallery"}
```yaml
grafico: matriz-dispersion
variables:
  - nombre: Estudio (h)
    valores: [2, 4, 5, 6, 3, 8, 7, 9, 1, 5, 6, 10]
  - nombre: Sueño (h)
    valores: [8, 7, 7, 6.5, 8, 6, 6, 5.5, 8.5, 7, 7.5, 5]
  - nombre: Calificación
    valores: [6.1, 7.0, 7.4, 7.9, 6.5, 8.6, 8.2, 8.8, 5.6, 7.6, 8.1, 9.0]
```
:::

## Propiedades

- **Simetría:** la celda $(j, k)$ y la $(k, j)$ contienen la misma información con los ejes intercambiados; algunas versiones dibujan solo el triángulo inferior.
- **Número de celdas:** crece como $p^2$; con más de ocho o diez variables las celdas se vuelven demasiado pequeñas.
- **Escalas compartidas** por fila y columna, que permiten seguir una variable a lo largo de la cuadrícula.
- **Grupos con color:** colorear por una variable categórica revela si las relaciones cambian entre grupos.

:::figura[Grupos que se separan: medidas de 15 plantas de tres variedades. Cada variedad ocupa su propia región en casi todas las celdas.]{componente="ChartGallery"}
```yaml
grafico: matriz-dispersion
variables:
  - nombre: Largo de hoja
    valores: [5.0, 5.2, 4.8, 5.1, 4.9, 6.4, 6.6, 6.1, 6.3, 6.8, 7.4, 7.7, 7.2, 7.9, 7.5]
  - nombre: Ancho de hoja
    valores: [3.4, 3.6, 3.2, 3.5, 3.1, 2.9, 3.0, 2.8, 2.7, 3.0, 3.1, 3.3, 3.0, 3.6, 3.2]
  - nombre: Largo de pétalo
    valores: [1.4, 1.5, 1.3, 1.6, 1.4, 4.5, 4.7, 4.2, 4.4, 4.9, 6.1, 6.4, 5.8, 6.6, 6.0]
grupos: [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2]
nombresGrupos: [Variedad A, Variedad B, Variedad C]
```
:::

## Errores comunes

- **Pensar que revisa todo.** Solo muestra relaciones de dos en dos; una relación que involucra a tres variables a la vez puede pasar inadvertida.
- **Interpretar la correlación global sin mirar los grupos.** Dentro de cada grupo la relación puede ser distinta, e incluso opuesta, a la de la nube completa.
- **Usarla con demasiadas variables.** Con 20 variables hay 400 celdas diminutas; conviene empezar por una [[matriz-de-correlacion]] y graficar solo los pares interesantes.

:::figura[Relación global que no existe dentro de los grupos: en tres sucursales el gasto en publicidad y las ventas no se relacionan dentro de cada una, pero al mezclarlas aparece una correlación fuerte entre sucursales.]{componente="ChartGallery"}
```yaml
grafico: matriz-dispersion
variables:
  - nombre: Publicidad
    valores: [10, 11, 12, 10.5, 11.5, 20, 21, 22, 20.5, 21.5, 30, 31, 32, 30.5, 31.5]
  - nombre: Ventas
    valores: [52, 50, 51, 49, 53, 72, 70, 73, 71, 69, 90, 93, 89, 92, 91]
  - nombre: Empleados
    valores: [8, 9, 7, 8, 9, 12, 11, 13, 12, 11, 15, 16, 14, 15, 16]
grupos: [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2]
nombresGrupos: [Sucursal 1, Sucursal 2, Sucursal 3]
```
:::

## Conexiones

Cada celda es un [[diagrama-de-dispersion]] y cada elemento de la diagonal un [[histograma]]. Su resumen numérico es la [[matriz-de-correlacion]], que ocupa la misma disposición con un número en lugar de una nube. Para muchas variables, el [[grafico-de-coordenadas-paralelas]] y el [[mapa-de-calor]] son alternativas más compactas.

## Formulario

:::formula[Contenido de la celda (j, k)]
$$
\{(x_{ik}, x_{ij}) : i = 1, \dots, n\}
$$

- $x_{ik}$: valor de la variable $k$ (eje horizontal) en la observación $i$.
- $x_{ij}$: valor de la variable $j$ (eje vertical) en la observación $i$.
- $n$: número de observaciones.
:::

:::formula[Número de celdas y de pares distintos]
$$
p^2 \text{ celdas},\qquad \binom{p}{2} = \frac{p(p - 1)}{2} \text{ pares distintos fuera de la diagonal}
$$

- $p$: número de variables.
- $\binom{p}{2}$: combinaciones de $p$ variables tomadas de dos en dos.
:::
