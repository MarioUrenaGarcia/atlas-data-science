---
id: raking
titulo: Raking
titulo_en: Raking
alias:
  - ajuste proporcional iterativo
  - IPF
  - calibración a márgenes
modulo: 5
submodulo: '5.1'
orden: 17
nivel: intermedio
prerrequisitos:
  - ponderacion-y-post-estratificacion
  - tablas-de-contingencia
relaciones:
  - tipo: generaliza
    id: ponderacion-y-post-estratificacion
etiquetas:
  - calibración
  - pesos de encuesta
  - tablas de contingencia
  - algoritmo iterativo
resumen: >
  Ajusta los pesos de una muestra para que reproduzca a la vez varias distribuciones marginales
  conocidas, como sexo y edad, sin conocer su cruce. Alterna escalamientos por filas y por columnas
  hasta que todos los márgenes coinciden.
formula: 'w_{ij} \leftarrow w_{ij}\,\frac{T_i}{\sum_{j} w_{ij}}, \qquad w_{ij} \leftarrow w_{ij}\,\frac{C_j}{\sum_{i} w_{ij}}'
visualizacion:
  componente: SamplingWeights
  parametros:
    modo: raking
    iteraciones: 5
    variable: Apoyo al programa de reciclaje
    filas:
      nombre: Sexo
      categorias: [Mujeres, Hombres]
      objetivos: [5200, 4800]
    columnas:
      nombre: Edad
      categorias: [18 a 34, 35 a 54, 55 o más]
      objetivos: [3500, 3800, 2700]
    muestra:
      - [90, 140, 120]
      - [60, 100, 90]
    medias:
      - [0.62, 0.48, 0.35]
      - [0.55, 0.41, 0.3]
referencias:
  - clave: lohr
    capitulo: '8'
publicado: true
---

## Intuición

Un municipio sabe, por el censo, cuántas mujeres y cuántos hombres adultos tiene, y cuántos adultos hay en cada grupo de edad. Pero no tiene a la mano el cruce: cuántas mujeres de 18 a 34 años, cuántos hombres de 55 o más, etcétera. Una encuesta sobre un programa de reciclaje tiene demasiadas mujeres y demasiadas personas mayores. ¿Cómo ponderarla si no se conoce la tabla completa?

El **raking** resuelve el problema ajustando una cosa a la vez. Primero se escalan los pesos para que los totales por sexo coincidan con el censo. Eso descuadra un poco los totales por edad, así que luego se escalan para que coincidan los de edad, lo que vuelve a descuadrar ligeramente los de sexo. Se repite: cada vuelta el descuadre es menor, y en pocas iteraciones ambos márgenes coinciden. El nombre viene del rastrillo que se pasa en una dirección y en la otra hasta emparejar la tierra.

## Definición

:::definicion[Raking o ajuste proporcional iterativo]
Sea una tabla de la muestra con $n_{ij}$ respondientes en la fila $i$ y la columna $j$, y totales poblacionales conocidos por fila $T_i$ y por columna $C_j$, con $\sum_i T_i = \sum_j C_j = N$. Se parte de $w_{ij}^{(0)} = n_{ij}\,N/n$ y en cada iteración se aplican dos pasos:
$$
w_{ij} \leftarrow w_{ij}\,\frac{T_i}{\sum_{j} w_{ij}}, \qquad w_{ij} \leftarrow w_{ij}\,\frac{C_j}{\sum_{i} w_{ij}}.
$$
El peso de cada respondiente de la celda $(i, j)$ es $w_{ij}/n_{ij}$.
:::

Si las celdas con $n_{ij} > 0$ permiten alcanzar ambos márgenes, el algoritmo converge a la tabla que reproduce los márgenes y es la más cercana a la de la muestra en el sentido de la información de Kullback-Leibler. El procedimiento se extiende a tres o más variables escalando por cada una en turno. Conserva la estructura de asociación de la muestra: la razón de momios de cada par de celdas no cambia con los escalamientos.

:::nota[Qué significa cada símbolo]
- $n_{ij}$: respondientes de la muestra en la fila $i$ y la columna $j$; $n$: total de respondientes.
- $T_i$: total conocido de la población en la fila $i$; $C_j$: en la columna $j$.
- $N$: tamaño de la población.
- $w_{ij}$: peso total de la celda $(i, j)$, el número de personas de la población que representa.
- $\sum_j w_{ij}$, $\sum_i w_{ij}$: márgenes ponderados actuales.
:::

## Cómo usar la visualización

La tabla muestra los pesos totales de cada celda. La columna "suma" compara cada fila con su total conocido y el renglón inferior hace lo mismo con las columnas; un borde rojo indica que el margen aún no coincide. Al reproducir se alternan los ajustes por filas y por columnas, y el encabezado muestra los factores de escala de cada paso.

Experimentos sugeridos:

- Observa que tras ajustar las columnas, las filas se desajustan un poco, y que el desajuste es menor en cada iteración.
- Sigue el indicador de mayor desajuste: en tres iteraciones baja de varios puntos porcentuales a casi cero.
- Compara la media de apoyo al inicio y al final: al dar más peso a los jóvenes, que apoyan más, la estimación sube.

## Ejemplo

Una muestra de 100 personas se reparte así: mujeres jóvenes 40, mujeres mayores 20, hombres jóvenes 10, hombres mayores 30. La población tiene 1000 personas: 500 mujeres y 500 hombres; 400 jóvenes y 600 mayores.

1. Inicio: $w^{(0)} = 10\,n_{ij}$, es decir $\begin{pmatrix} 400 & 200 \\ 100 & 300 \end{pmatrix}$, con filas 600 y 400.
2. Filas: factores $500/600 = 0.833$ y $500/400 = 1.25$; la tabla queda $\begin{pmatrix} 333.3 & 166.7 \\ 125 & 375 \end{pmatrix}$, con columnas 458.3 y 541.7.
3. Columnas: factores $400/458.3 = 0.873$ y $600/541.7 = 1.108$; la tabla queda $\begin{pmatrix} 290.9 & 184.6 \\ 109.1 & 415.4 \end{pmatrix}$, con filas 475.5 y 524.5.
4. Segunda iteración por filas: factores $1.052$ y $0.953$, y las filas vuelven a 500; las columnas quedan en 410 y 590, más cerca de 400 y 600 que antes.
5. Al converger, cada mujer joven de la muestra pesa alrededor de $300/40 \approx 7.5$ personas.

:::figura[El ejemplo de dos por dos: los pesos se alternan entre filas y columnas hasta que las cuatro sumas coinciden con 500, 500, 400 y 600.]{componente="SamplingWeights"}
```yaml
modo: raking
iteraciones: 6
filas:
  nombre: Sexo
  categorias: [Mujeres, Hombres]
  objetivos: [500, 500]
columnas:
  nombre: Edad
  categorias: [Jóvenes, Mayores]
  objetivos: [400, 600]
muestra:
  - [40, 20]
  - [10, 30]
```
:::

## Propiedades

- **Reproduce todos los márgenes usados** una vez que converge.
- **Conserva las razones de momios de la muestra**: $\frac{w_{11}w_{22}}{w_{12}w_{21}} = \frac{n_{11}n_{22}}{n_{12}n_{21}}$ en todo momento, porque cada paso multiplica filas o columnas completas.
- **No necesita la tabla cruzada de la población**, solo sus márgenes; si la tabla cruzada se conoce, la post-estratificación por celdas es preferible.
- **Converge rápido** en tablas sin celdas vacías: el desajuste suele bajar a una fracción mínima en cuatro o cinco iteraciones.

:::figura[Propiedad de convergencia con dos variables de tres categorías cada una, región y nivel socioeconómico (tabla de tres por tres): en pocas iteraciones el mayor desajuste de un margen baja prácticamente a cero.]{componente="SamplingWeights"}
```yaml
modo: raking
iteraciones: 5
variable: Usa transporte público
filas:
  nombre: Región
  categorias: [Norte, Centro, Sur]
  objetivos: [3000, 4500, 2500]
columnas:
  nombre: Nivel socioeconómico
  categorias: [Bajo, Medio, Alto]
  objetivos: [4000, 4000, 2000]
muestra:
  - [30, 40, 50]
  - [60, 90, 70]
  - [20, 25, 15]
medias:
  - [0.71, 0.52, 0.2]
  - [0.8, 0.61, 0.33]
  - [0.66, 0.47, 0.18]
```
:::

## Errores comunes

- **Usar márgenes que no suman lo mismo.** Si los totales por sexo suman 10000 y los de edad 9500, no existe una tabla que cumpla ambos y el algoritmo oscila sin converger.
- **Esperar que una celda vacía se llene.** Si en la muestra no hay hombres mayores, su peso es cero en todas las iteraciones; el raking no inventa respondientes.
- **Creer que el raking corrige asociaciones mal representadas.** Si en la muestra los jóvenes son desproporcionadamente mujeres, esa asociación se conserva; solo se corrigen los márgenes.

:::figura[Error de márgenes inconsistentes: los totales por turno suman 1000 y los de antigüedad 900. Después de cada paso un margen coincide y el otro no, y el desajuste se queda cerca de 6 % sin llegar nunca a cero.]{componente="SamplingWeights"}
```yaml
modo: raking
iteraciones: 6
filas:
  nombre: Turno
  categorias: [Matutino, Vespertino]
  objetivos: [600, 400]
columnas:
  nombre: Antigüedad
  categorias: [Menos de 5 años, 5 años o más]
  objetivos: [500, 400]
muestra:
  - [30, 25]
  - [20, 25]
```
:::

## Conexiones

El raking extiende la [[ponderacion-y-post-estratificacion]] a varias variables cuyos cruces no se conocen. Opera sobre [[tablas-de-contingencia]] y conserva su estructura de asociación, medida por la razón de momios. Como algoritmo, es un caso de optimización por coordenadas: cada paso resuelve exactamente el ajuste de un margen manteniendo los demás pesos en proporción, lo que lo relaciona con el [[descenso-por-coordenadas]].

## Formulario

:::formula[Paso por filas]
$$
w_{ij} \leftarrow w_{ij}\,\frac{T_i}{\sum_{j} w_{ij}}
$$

- $w_{ij}$: peso total de la celda $(i, j)$.
- $T_i$: total conocido de la fila $i$.
:::

:::formula[Paso por columnas]
$$
w_{ij} \leftarrow w_{ij}\,\frac{C_j}{\sum_{i} w_{ij}}
$$

- $C_j$: total conocido de la columna $j$.
:::

:::formula[Punto de partida]
$$
w_{ij}^{(0)} = n_{ij}\,\frac{N}{n}
$$

- $n_{ij}$: respondientes de la celda; $n$: total de respondientes; $N$: tamaño de la población.
:::

:::formula[Invariancia de la razón de momios]
$$
\frac{w_{11}\,w_{22}}{w_{12}\,w_{21}} = \frac{n_{11}\,n_{22}}{n_{12}\,n_{21}}
$$

- Se cumple en cada iteración, porque los pasos multiplican filas o columnas completas.
:::
