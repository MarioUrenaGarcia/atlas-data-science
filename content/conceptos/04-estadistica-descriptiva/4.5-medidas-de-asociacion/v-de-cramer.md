---
id: v-de-cramer
titulo: V de Cramér
titulo_en: Cramér's V
alias:
  - coeficiente V de Cramér
  - phi de Cramér
modulo: 4
submodulo: '4.5'
orden: 11
nivel: basico
prerrequisitos:
  - coeficiente-phi
etiquetas:
  - asociación
  - variables categóricas
  - chi cuadrada
  - tablas de contingencia
resumen: >
  La V de Cramér mide la intensidad de la asociación entre dos variables categóricas en tablas de
  cualquier tamaño. Vale 0 con independencia y 1 cuando una variable determina por completo a la otra.
formula: 'V = \sqrt{\frac{\chi^2}{n\,(k - 1)}}, \qquad k = \min(I, J)'
visualizacion:
  componente: AssociationViz
  parametros:
    modo: contingencia
    enfoque: cramer
    filas:
      nombre: Edad
      categorias: [Joven, Adulto, Mayor]
    columnas:
      nombre: Medio de noticias
      categorias: [Redes sociales, Televisión, Prensa]
    conteos:
      - [18, 12, 10]
      - [8, 22, 10]
      - [6, 9, 25]
referencias:
  - clave: agresti
    capitulo: '2'
publicado: true
---

## Intuición

Para saber si la edad se relaciona con el medio por el que las personas se informan, se cruza una variable de tres categorías con otra de tres categorías. El coeficiente phi ya no sirve: en tablas mayores que 2 por 2 su valor puede pasar de 1. Hace falta una medida que tome en cuenta el tamaño de la tabla.

La **V de Cramér** parte de la estadística chi cuadrada, que suma, celda por celda, qué tan lejos está cada conteo de lo que se esperaría si no hubiera asociación. Esa suma crece con el número de observaciones y con el tamaño de la tabla, así que se divide entre ambos. El resultado queda entre 0 y 1: 0 si las filas tienen exactamente los mismos porcentajes, 1 si cada categoría de una variable va siempre con una sola categoría de la otra. No tiene signo, porque en variables nominales no hay "aumentar" ni "disminuir".

## Definición

:::definicion[V de Cramér]
Para una tabla de contingencia de $I$ filas y $J$ columnas con $n$ observaciones y estadística chi cuadrada
$$
\chi^2 = \sum_{i=1}^{I}\sum_{j=1}^{J}\frac{(n_{ij} - E_{ij})^2}{E_{ij}}, \qquad E_{ij} = \frac{n_{i\cdot}\,n_{\cdot j}}{n},
$$
la **V de Cramér** es
$$
V = \sqrt{\frac{\chi^2}{n\,(k - 1)}}, \qquad k = \min(I, J).
$$
:::

En tablas de 2 por 2, $k = 2$ y $V = |\phi|$. Como orientación informal, valores de 0.1, 0.3 y 0.5 suelen describirse como asociación débil, moderada y fuerte, aunque la interpretación depende del contexto y del número de categorías.

:::figura[Asociación perfecta en una tabla de 3 por 3: cada tipo de suelo produce siempre el mismo cultivo dominante. Todos los casos están en la diagonal y V vale 1.]{componente="AssociationViz"}
```yaml
modo: contingencia
enfoque: cramer
filas:
  nombre: Tipo de suelo
  categorias: [Arcilloso, Arenoso, Limoso]
columnas:
  nombre: Cultivo dominante
  categorias: [Arroz, Cacahuate, Trigo]
conteos:
  - [30, 0, 0]
  - [0, 30, 0]
  - [0, 0, 30]
```
:::

:::nota[Qué significa cada símbolo]
- $V$: V de Cramér, entre 0 y 1.
- $\chi^2$: estadística chi cuadrada de la tabla.
- $n_{ij}$: conteo observado de la celda; $E_{ij}$: conteo esperado bajo independencia.
- $n_{i\cdot}$, $n_{\cdot j}$: totales de la fila $i$ y de la columna $j$; $n$: total.
- $I$, $J$: número de filas y de columnas; $k = \min(I, J)$.
- $\phi$: coeficiente phi de una tabla de 2 por 2.
:::

## Cómo usar la visualización

La tabla cruza tres grupos de edad con tres medios de noticias. La reproducción recorre las nueve celdas: para cada una calcula el conteo esperado, lo muestra debajo del observado y suma el término $(O - E)^2/E$ a la chi cuadrada acumulada. Al terminar, el encabezado divide entre $n(k - 1)$ y saca la raíz.

Las celdas que más aportan están en la diagonal: jóvenes con redes sociales, adultos con televisión y mayores con prensa, donde lo observado supera mucho a lo esperado. En las barras de la derecha, cada grupo de edad tiene un medio dominante distinto. El resultado, $V \approx 0.32$, indica una asociación moderada.

## Ejemplo

En una planta, 100 piezas se clasifican por turno (mañana, tarde) y resultado de inspección (aprobada, rechazada, retrabajo): mañana 25, 15, 10; tarde 10, 20, 20.

1. Totales: filas 50 y 50; columnas 35, 35 y 30.
2. Esperados en la fila de la mañana: $50 \cdot 35/100 = 17.5$, $17.5$ y $15$; igual en la tarde.
3. Términos: $(25 - 17.5)^2/17.5 = 3.214$, $(15 - 17.5)^2/17.5 = 0.357$, $(10 - 15)^2/15 = 1.667$, y por simetría lo mismo en la tarde. $\chi^2 = 2(3.214 + 0.357 + 1.667) \approx 10.476$.
4. $k = \min(2, 3) = 2$. $V = \sqrt{10.476/(100 \cdot 1)} \approx 0.324$.
5. El turno se asocia de forma moderada con el resultado: la mañana aprueba más piezas.

:::figura[Las piezas del ejemplo, celda por celda, hasta V = 0.324.]{componente="AssociationViz"}
```yaml
modo: contingencia
enfoque: cramer
filas:
  nombre: Turno
  categorias: [Mañana, Tarde]
columnas:
  nombre: Resultado
  categorias: [Aprobada, Rechazada, Retrabajo]
conteos:
  - [25, 15, 10]
  - [10, 20, 20]
```
:::

## Propiedades

- **Rango:** $0 \le V \le 1$. $V = 0$ si y solo si cada conteo coincide con su esperado.
- **$V = 1$** cuando, en la variable con menos categorías, cada categoría se asocia con una sola de la otra.
- **No depende de $n$ si las proporciones no cambian:** multiplicar todos los conteos por 10 multiplica $\chi^2$ por 10 pero deja $V$ igual.
- **Simétrica:** no distingue cuál variable es la explicativa.

:::figura[Propiedad de invariancia ante el tamaño: la tabla del ejemplo con todos los conteos multiplicados por 10. La chi cuadrada es diez veces mayor y V sigue en 0.324.]{componente="AssociationViz"}
```yaml
modo: contingencia
enfoque: cramer
filas:
  nombre: Turno
  categorias: [Mañana, Tarde]
columnas:
  nombre: Resultado
  categorias: [Aprobada, Rechazada, Retrabajo]
conteos:
  - [250, 150, 100]
  - [100, 200, 200]
```
:::

## Errores comunes

- **Comparar chi cuadrada entre tablas de distinto tamaño.** Chi cuadrada crece con $n$ y con el número de celdas; para comparar intensidad se usa V.
- **Leer V como una correlación con signo o dirección.** V no dice qué categorías van juntas; para eso hay que mirar los porcentajes por fila o las celdas con mayor aporte.
- **Aplicarla con conteos esperados muy pequeños.** Con celdas casi vacías, V es inestable y se infla por azar.

:::figura[Con pocas observaciones, una tabla sin asociación real puede dar V de 0.2: diez lanzamientos de dos monedas.]{componente="AssociationViz"}
```yaml
modo: contingencia
enfoque: cramer
filas:
  nombre: Moneda A
  categorias: [Águila, Sol]
columnas:
  nombre: Moneda B
  categorias: [Águila, Sol]
conteos:
  - [3, 2]
  - [2, 3]
```
:::

## Conexiones

La V de Cramér generaliza el [[coeficiente-phi]] a [[tablas-de-contingencia]] de cualquier tamaño, y en tablas de 2 por 2 coincide con su valor absoluto. Se basa en la estadística chi cuadrada, que también es la base de la prueba de independencia. La [[informacion-mutua-empirica]] es otra forma de medir la asociación entre variables categóricas.

## Formulario

:::formula[V de Cramér]
$$
V = \sqrt{\frac{\chi^2}{n\,(k - 1)}}
$$

- $\chi^2$: chi cuadrada; $n$: total; $k = \min(I, J)$.
:::

:::formula[Chi cuadrada]
$$
\chi^2 = \sum_{i,j}\frac{(n_{ij} - E_{ij})^2}{E_{ij}}
$$

- $n_{ij}$: observados; $E_{ij}$: esperados.
:::

:::formula[Conteo esperado]
$$
E_{ij} = \frac{n_{i\cdot}\,n_{\cdot j}}{n}
$$

- $n_{i\cdot}$, $n_{\cdot j}$: totales marginales.
:::
