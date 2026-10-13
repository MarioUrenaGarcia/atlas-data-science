---
id: tablas-de-contingencia
titulo: Tablas de contingencia
titulo_en: Contingency tables
alias:
  - tabla de doble entrada
  - tabulación cruzada
  - tabla cruzada
modulo: 4
submodulo: '4.5'
orden: 9
nivel: basico
prerrequisitos:
  - moda
etiquetas:
  - asociación
  - variables categóricas
  - frecuencias conjuntas
  - independencia
resumen: >
  Una tabla de contingencia cuenta cuántas observaciones caen en cada combinación de categorías de dos
  variables cualitativas. Sus porcentajes por fila o por columna revelan si las variables están asociadas.
formula: 'n_{ij} = \#\{\text{observaciones con } X = i,\ Y = j\}, \qquad E_{ij} = \frac{n_{i\cdot}\,n_{\cdot j}}{n}'
visualizacion:
  componente: AssociationViz
  parametros:
    modo: contingencia
    enfoque: tabla
    filas:
      nombre: Zona
      categorias: [Centro, Periferia]
    columnas:
      nombre: Transporte
      categorias: [Auto, Transporte público, Bicicleta]
    conteos:
      - [20, 45, 15]
      - [50, 30, 5]
referencias:
  - clave: agresti
    capitulo: '2'
publicado: true
---

## Intuición

Una encuesta pregunta a 165 personas en qué zona de la ciudad viven y qué medio de transporte usan para ir al trabajo. Ambas respuestas son categorías, así que no se pueden graficar en un diagrama de dispersión ni calcular una correlación de Pearson. Lo natural es contar: cuántas personas del centro usan auto, cuántas usan transporte público, y lo mismo para la periferia. Esos conteos, acomodados en filas (zonas) y columnas (transporte), forman una **tabla de contingencia**.

Los conteos crudos son difíciles de comparar porque hay distinto número de personas en cada zona. Por eso se calculan porcentajes dentro de cada fila: en el centro, 56 % usa transporte público; en la periferia, solo 35 %. Si la zona no tuviera nada que ver con el transporte, los porcentajes serían parecidos en las dos filas. Que difieran tanto indica una asociación entre las variables.

## Definición

:::definicion[Tabla de contingencia]
Para dos variables cualitativas $X$, con $I$ categorías, y $Y$, con $J$ categorías, la **tabla de contingencia** es la matriz de conteos $n_{ij}$, el número de observaciones con $X = i$ y $Y = j$. Sus **totales marginales** son $n_{i\cdot} = \sum_j n_{ij}$ (filas) y $n_{\cdot j} = \sum_i n_{ij}$ (columnas), y $n = \sum_{i,j} n_{ij}$.
:::

Se usan tres tipos de proporciones: **conjuntas** $n_{ij}/n$, **por fila** $n_{ij}/n_{i\cdot}$ (distribución de $Y$ dentro de cada categoría de $X$) y **por columna** $n_{ij}/n_{\cdot j}$. Bajo independencia, los conteos esperados son
$$
E_{ij} = \frac{n_{i\cdot}\,n_{\cdot j}}{n},
$$
y todas las filas tendrían los mismos porcentajes.

:::figura[Tabla de 2 por 2: hábito de fumar y presencia de tos crónica en 100 adultos. Las barras muestran que la tos es mucho más frecuente entre fumadores.]{componente="AssociationViz"}
```yaml
modo: contingencia
enfoque: tabla
filas:
  nombre: Fuma
  categorias: [Sí, No]
columnas:
  nombre: Tos crónica
  categorias: [Sí, No]
conteos:
  - [45, 5]
  - [10, 40]
```
:::

:::nota[Qué significa cada símbolo]
- $n_{ij}$: número de observaciones en la fila $i$ y la columna $j$.
- $I$, $J$: número de categorías de cada variable.
- $n_{i\cdot}$: total de la fila $i$; $n_{\cdot j}$: total de la columna $j$; el punto indica que se sumó sobre ese índice.
- $n$: total de observaciones.
- $E_{ij}$: conteo esperado en la celda $(i, j)$ si las variables fueran independientes.
- $\#\{\cdot\}$: número de elementos del conjunto.
:::

## Cómo usar la visualización

La tabla cruza zona y medio de transporte. El selector cambia entre conteos y porcentajes por fila, por columna o del total; la reproducción recorre las celdas y el encabezado muestra la división que produce cada porcentaje. Las barras de la derecha reparten cada fila en porcentajes; la última barra es la distribución de todas las personas juntas.

La barra del centro tiene mucho más transporte público y bicicleta que la de la periferia, que está dominada por el auto. Si no hubiera asociación, las dos barras se parecerían a la de todos. Con porcentajes por columna, la lectura cambia de pregunta: de los ciclistas, qué fracción vive en el centro.

## Ejemplo

Con los conteos de la encuesta (centro: 20 en auto, 45 en transporte público, 15 en bicicleta; periferia: 50, 30 y 5):

1. Totales: centro 80, periferia 85; auto 70, transporte público 75, bicicleta 20; total 165.
2. Porcentajes por fila en el centro: $20/80 = 25$ %, $45/80 = 56.25$ %, $15/80 = 18.75$ %.
3. En la periferia: $50/85 = 58.8$ %, $30/85 = 35.3$ %, $5/85 = 5.9$ %.
4. Conteo esperado de autos en el centro bajo independencia: $E_{11} = 80 \cdot 70/165 \approx 33.9$. Se observaron 20, muchos menos.
5. Conclusión descriptiva: en el centro predomina el transporte público y en la periferia el auto.

:::figura[Los conteos esperados del ejemplo: con el enfoque de chi cuadrada, cada celda muestra debajo el conteo esperado bajo independencia.]{componente="AssociationViz"}
```yaml
modo: contingencia
enfoque: cramer
filas:
  nombre: Zona
  categorias: [Centro, Periferia]
columnas:
  nombre: Transporte
  categorias: [Auto, Transporte público, Bicicleta]
conteos:
  - [20, 45, 15]
  - [50, 30, 5]
```
:::

## Propiedades

- **Independencia empírica:** las filas tienen los mismos porcentajes si y solo si cada conteo coincide con su esperado, $n_{ij} = E_{ij}$.
- **Las marginales no dicen nada de la asociación:** dos tablas con los mismos totales pueden tener asociaciones muy distintas.
- **Direcciones de lectura:** los porcentajes por fila comparan la distribución de $Y$ entre grupos de $X$; los porcentajes por columna, la de $X$ entre grupos de $Y$. Ambos responden preguntas distintas.
- **Moda condicional:** la categoría más frecuente en cada fila es la moda de $Y$ dentro de ese grupo.

:::figura[Independencia exacta: preferencia por dos marcas en dos ciudades con proporciones idénticas (40 % y 60 % en ambas). Todas las barras son iguales y cada conteo coincide con su esperado.]{componente="AssociationViz"}
```yaml
modo: contingencia
enfoque: tabla
filas:
  nombre: Ciudad
  categorias: [Puebla, Querétaro]
columnas:
  nombre: Marca preferida
  categorias: [Marca A, Marca B]
conteos:
  - [20, 30]
  - [40, 60]
```
:::

## Errores comunes

- **Comparar conteos en lugar de porcentajes.** Si una fila tiene el doble de personas, sus conteos serán mayores aunque la distribución sea la misma.
- **Calcular porcentajes en la dirección equivocada.** "El 80 % de los hospitalizados no estaba vacunado" y "el 4 % de los no vacunados fue hospitalizado" usan la misma tabla y responden preguntas distintas.
- **Ignorar una tercera variable.** Al agregar tablas de grupos distintos, la asociación puede cambiar o invertirse.

:::figura[Dirección de los porcentajes: hospitalización según vacunación en 2000 personas. Con porcentajes por fila se compara el riesgo de cada grupo; con porcentajes por columna, la composición de los hospitalizados.]{componente="AssociationViz"}
```yaml
modo: contingencia
enfoque: tabla
filas:
  nombre: Vacunación
  categorias: [Vacunado, No vacunado]
columnas:
  nombre: Hospitalización
  categorias: [Sí, No]
conteos:
  - [10, 990]
  - [40, 960]
```
:::

## Conexiones

Las tablas de contingencia resumen dos variables [[datos-cualitativos-y-cuantitativos|cualitativas]], cuyas categorías más frecuentes son la [[moda]]. La intensidad de su asociación se mide con el [[coeficiente-phi]] en tablas de 2 por 2, la [[v-de-cramer]] en tablas mayores y la [[informacion-mutua-empirica]]. Gráficamente se representan con barras apiladas al 100 % o con diagramas de mosaico.

## Formulario

:::formula[Totales marginales]
$$
n_{i\cdot} = \sum_{j=1}^{J} n_{ij}, \qquad n_{\cdot j} = \sum_{i=1}^{I} n_{ij}, \qquad n = \sum_{i,j} n_{ij}
$$

- $n_{ij}$: conteo de la celda; $I$, $J$: número de filas y columnas.
:::

:::formula[Porcentaje por fila]
$$
\hat{p}_{j \mid i} = \frac{n_{ij}}{n_{i\cdot}}
$$

- $\hat{p}_{j \mid i}$: proporción de la categoría $j$ de $Y$ dentro de la categoría $i$ de $X$.
:::

:::formula[Conteo esperado bajo independencia]
$$
E_{ij} = \frac{n_{i\cdot}\,n_{\cdot j}}{n}
$$

- $E_{ij}$: conteo que tendría la celda si las variables no estuvieran asociadas.
:::
