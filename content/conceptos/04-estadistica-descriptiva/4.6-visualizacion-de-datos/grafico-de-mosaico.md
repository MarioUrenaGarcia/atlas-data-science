---
id: grafico-de-mosaico
titulo: Gráfico de mosaico
titulo_en: Mosaic plot
alias:
  - diagrama de mosaico
  - gráfico de Marimekko
modulo: 4
submodulo: '4.6'
orden: 17
nivel: basico
prerrequisitos:
  - tablas-de-contingencia
  - grafico-de-barras
relaciones:
  - tipo: relacionado
    id: v-de-cramer
etiquetas:
  - visualización
  - datos categóricos
  - proporciones condicionales
  - asociación
resumen: >
  El gráfico de mosaico representa una tabla de contingencia con rectángulos cuya área es proporcional
  a cada conteo: el ancho sigue la distribución de una variable y la altura la de la otra dentro de
  cada columna.
formula: '\text{ancho}_j = \frac{n_{j\cdot}}{n},\qquad \text{alto}_{k \mid j} = \frac{n_{jk}}{n_{j\cdot}}'
visualizacion:
  componente: ChartGallery
  parametros:
    grafico: mosaico
    filas:
      nombre: Clase
      categorias: [Primera, Segunda, Tercera, Tripulación]
    columnas:
      nombre: Destino
      categorias: [Sobrevivió, No sobrevivió]
    conteos:
      - [203, 122]
      - [118, 167]
      - [178, 528]
      - [212, 673]
referencias:
  - clave: agresti
    capitulo: '2'
publicado: true
---

## Intuición

En el hundimiento del Titanic viajaban 2201 personas entre pasajeros de tres clases y tripulación. Una tabla de contingencia cruza la clase con el destino: sobrevivió o no. Para verla, se toma un cuadrado y se divide primero en franjas verticales, una por clase, con ancho proporcional al número de personas de esa clase. Después, cada franja se corta horizontalmente según la proporción que sobrevivió dentro de esa clase.

El resultado es un **gráfico de mosaico**: cada rectángulo tiene área proporcional a su conteo. Las franjas anchas muestran las clases más numerosas (la tripulación y la tercera clase), y la altura de los cortes muestra la proporción condicional de supervivencia. Si la clase no tuviera relación con sobrevivir, todos los cortes quedarían a la misma altura; en el Titanic quedan muy desalineados, señal de una asociación fuerte.

## Definición

:::definicion[Gráfico de mosaico]
Sea una tabla de contingencia con conteos $n_{jk}$ para la categoría $j$ de la variable $A$ y la categoría $k$ de la variable $B$, con totales por fila $n_{j\cdot} = \sum_k n_{jk}$ y total general $n$. El **gráfico de mosaico** divide un cuadrado unitario en franjas verticales de ancho

$$
w_j = \frac{n_{j\cdot}}{n}
$$

y corta cada franja en rectángulos de altura

$$
h_{k \mid j} = \frac{n_{jk}}{n_{j\cdot}},
$$

la proporción condicional de $B = k$ dado $A = j$. El área de cada rectángulo es $w_j \, h_{k \mid j} = n_{jk}/n$.
:::

Bajo independencia, $h_{k \mid j}$ sería igual a la proporción marginal $n_{\cdot k}/n$ para toda $j$, y los cortes horizontales quedarían alineados.

:::nota[Qué significa cada símbolo]
- $n_{jk}$: número de observaciones con $A = j$ y $B = k$.
- $n_{j\cdot}$: total de la categoría $j$ de $A$; $n_{\cdot k}$: total de la categoría $k$ de $B$.
- $n$: total general.
- $w_j$: ancho de la franja de la categoría $j$.
- $h_{k \mid j}$: altura del rectángulo de $B = k$ dentro de la franja $j$.
:::

## Cómo usar la visualización

Las franjas se cortan columna por columna. Las líneas punteadas marcan dónde quedarían los cortes si no hubiera asociación, y el encabezado muestra la V de Cramér de la tabla.

Experimentos sugeridos:

1. Comparar la franja de primera clase con la de tripulación: la primera es angosta pero con un rectángulo de supervivencia alto; la tripulación es ancha con uno bajo.
2. Medir la distancia entre cada corte y la línea punteada: cuanto más se aleja, más contribuye esa clase a la asociación.
3. Observar que las áreas de los rectángulos inferiores de tercera clase y tripulación son las mayores: ahí está la mayoría de las víctimas.

## Ejemplo

Una planta registra 800 piezas por turno y resultado:

| Turno  | Sin defecto | Con defecto | Total |
| ------ | ----------- | ----------- | ----- |
| Mañana | 460         | 40          | 500   |
| Noche  | 210         | 90          | 300   |

1. Anchos: $w_{\text{mañana}} = 500/800 = 0.625$ y $w_{\text{noche}} = 300/800 = 0.375$.
2. Alturas de "con defecto": $40/500 = 0.08$ en la mañana y $90/300 = 0.30$ en la noche.
3. Proporción marginal de defectos: $130/800 = 0.1625$; ese sería el corte común bajo independencia.
4. Área del rectángulo noche y con defecto: $0.375 \cdot 0.30 = 0.1125 = 90/800$.

:::figura[Las 800 piezas del ejemplo: la franja de la noche es más angosta y su rectángulo de defectos, mucho más alto que la línea de independencia.]{componente="ChartGallery"}
```yaml
grafico: mosaico
filas:
  nombre: Turno
  categorias: [Mañana, Noche]
columnas:
  nombre: Resultado
  categorias: [Sin defecto, Con defecto]
conteos:
  - [460, 40]
  - [210, 90]
```
:::

## Propiedades

- **Área proporcional al conteo:** $w_j h_{k \mid j} = n_{jk}/n$.
- **Independencia como alineación:** sin asociación, todos los cortes coinciden con la línea punteada.
- **Orden de las variables:** dividir primero por $A$ muestra $P(B \mid A)$; dividir primero por $B$ muestra $P(A \mid B)$.

:::figura[Independencia: preferencia de bebida por grupo de edad en 600 personas, con proporciones iguales en cada grupo. Los cortes quedan alineados sobre la línea punteada.]{componente="ChartGallery"}
```yaml
grafico: mosaico
filas:
  nombre: Edad
  categorias: [Joven, Adulto, Mayor]
columnas:
  nombre: Bebida
  categorias: [Café, Té, Agua]
conteos:
  - [100, 60, 40]
  - [150, 90, 60]
  - [50, 30, 20]
```
:::

## Errores comunes

- **Comparar solo alturas sin ver los anchos.** Un rectángulo alto en una franja angosta puede contener pocas observaciones; el conteo es el área, no la altura.
- **Olvidar qué variable se dividió primero.** El mismo cruce leído en el otro orden responde otra pregunta.
- **Usarlo con muchas categorías.** Con más de cinco categorías por variable los rectángulos se vuelven diminutos.

:::figura[El Titanic con el orden invertido: primero se divide por destino y después por clase. Ahora se lee la composición por clase de sobrevivientes y de víctimas.]{componente="ChartGallery"}
```yaml
grafico: mosaico
filas:
  nombre: Destino
  categorias: [Sobrevivió, No sobrevivió]
columnas:
  nombre: Clase
  categorias: [Primera, Segunda, Tercera, Tripulación]
conteos:
  - [203, 118, 178, 212]
  - [122, 167, 528, 673]
```
:::

## Conexiones

El mosaico dibuja una [[tablas-de-contingencia|tabla de contingencia]] y sus desviaciones respecto a la independencia, que la [[v-de-cramer]] y el [[coeficiente-phi]] resumen en un número. Cada franja es una barra apilada al 100 % de un [[grafico-de-barras]], con ancho variable. Comparado con el [[grafico-de-pastel-y-sus-limitaciones|gráfico de pastel]], permite comparar proporciones condicionales alineadas.

## Formulario

:::formula[Ancho de cada franja]
$$
w_j = \frac{n_{j\cdot}}{n}
$$

- $w_j$: ancho de la franja de la categoría $j$.
- $n_{j\cdot}$: total de la categoría $j$; $n$: total general.
:::

:::formula[Altura condicional]
$$
h_{k \mid j} = \frac{n_{jk}}{n_{j\cdot}}
$$

- $h_{k \mid j}$: proporción de $B = k$ dentro de $A = j$.
- $n_{jk}$: conteo de la celda $(j, k)$.
:::

:::formula[Área de cada rectángulo]
$$
w_j\, h_{k \mid j} = \frac{n_{jk}}{n}
$$

- El área es la proporción del total que cae en la celda $(j, k)$.
:::

:::formula[Corte bajo independencia]
$$
h_{k \mid j} = \frac{n_{\cdot k}}{n}\quad \text{para toda } j
$$

- $n_{\cdot k}$: total de la categoría $k$ de $B$.
:::
