---
id: sesgo-de-supervivencia
titulo: Sesgo de supervivencia
titulo_en: Survivorship bias
alias:
  - sesgo del sobreviviente
  - sesgo de los supervivientes
modulo: 5
submodulo: '5.1'
orden: 20
nivel: basico
prerrequisitos:
  - sesgo-de-seleccion
relaciones:
  - tipo: relacionado
    id: sesgo-de-no-respuesta
etiquetas:
  - sesgo
  - datos censurados
  - finanzas
  - selección por resultado
resumen: >
  Sesgo que aparece al analizar solo las unidades que siguen existiendo después de un proceso que
  elimina a las de peor desempeño. Los sobrevivientes parecen mejores de lo que fue el grupo completo.
formula: '\bar{r}_{\text{sobrevivientes}} - \bar{r}_{\text{todos}} > 0 \quad \text{si la permanencia depende de } r'
visualizacion:
  componente: SamplingProcess
  parametros:
    modo: supervivencia
    unidades: 60
    periodos: 10
    media: 0.03
    dispersion: 0.03
    volatilidad: 0.15
    umbral: 0.7
    nombreUnidad: Fondo
    nombrePeriodo: Año
    variable: Rendimiento anual
referencias:
  - clave: tsay
  - clave: hernan-robins
publicado: true
---

## Intuición

Un folleto presume que los fondos de inversión de cierta categoría rindieron en promedio 5 % anual durante los últimos diez años. El cálculo usa los fondos que hoy siguen abiertos. Pero en esos diez años muchos fondos cerraron, y casi siempre cierran los que pierden dinero: los clientes retiran su inversión y la operadora los fusiona o los liquida. Los fondos que hoy existen son, por construcción, los que tuvieron suerte o buen desempeño.

El **sesgo de supervivencia** aparece cuando un proceso de filtrado elimina unidades según su resultado y luego se analiza solo lo que quedó. Pasa con empresas (se estudian las exitosas para buscar la receta del éxito), con edificios antiguos (los que siguen en pie parecen mejor construidos que los modernos) o con aviones que regresan de una misión: si se refuerzan las zonas con más agujeros de bala en los aviones que volvieron, se refuerza justo donde un impacto no derriba el avión. La información crucial está en lo que ya no se ve.

## Definición

:::definicion[Sesgo de supervivencia]
Sean $N$ unidades observadas durante $T$ periodos, y sea $D_i \in \{0, 1\}$ la indicadora de que la unidad $i$ sobrevivió hasta el final. Si la probabilidad de sobrevivir depende del resultado $r_i$ (por ejemplo, $D_i = 1$ solo si el valor acumulado no cae por debajo de un umbral), entonces
$$
\mathbb{E}[r \mid D = 1] \ne \mathbb{E}[r],
$$
y el promedio de los sobrevivientes es un estimador sesgado del promedio de todas las unidades. Cuando sobrevivir es más probable con resultados altos, el sesgo es positivo.
:::

Es un caso de sesgo de selección en el que la selección ocurre con el tiempo y está determinada por la propia variable de interés. Su corrección requiere recuperar los datos de las unidades que desaparecieron, o al menos su número y el momento en que salieron, como en las bases de datos "libres de sesgo de supervivencia" que conservan los fondos y empresas extintos.

:::nota[Qué significa cada símbolo]
- $N$: número de unidades al inicio; $T$: número de periodos.
- $r_i$: resultado de la unidad $i$, por ejemplo su rendimiento promedio por periodo.
- $D_i$: vale 1 si la unidad sigue al final del periodo de estudio y 0 si desapareció.
- $\mathbb{E}[r \mid D = 1]$: promedio del resultado entre los sobrevivientes.
- $\mathbb{E}[r]$: promedio del resultado entre todas las unidades.
:::

## Cómo usar la visualización

Cada línea es el valor acumulado de un fondo que empieza en 1. Al reproducir avanzan los años; cuando un fondo cae por debajo del umbral (línea punteada gris), cierra y su línea se vuelve roja y punteada. El encabezado compara el rendimiento promedio de los fondos que siguen abiertos con el de todos los fondos, incluidos los cerrados.

Experimentos sugeridos:

- Observa que el sesgo crece con los años, a medida que se acumulan los cierres.
- Baja el umbral a 0: ningún fondo cierra y el sesgo desaparece.
- Apaga "Mostrar las unidades cerradas" para ver la gráfica tal como la vería quien solo consulta los fondos vigentes.

## Ejemplo

Una base de datos tiene 100 fondos al inicio de una década. Al final quedan 70. Los 70 sobrevivientes rindieron en promedio 6 % anual; los 30 que cerraron rindieron $-4$ % anual mientras existieron (en promedio, durante cinco años).

1. Promedio de los sobrevivientes: 6 % anual.
2. Años-fondo observados: $70 \cdot 10 = 700$ de sobrevivientes y $30 \cdot 5 = 150$ de fondos cerrados.
3. Promedio de todos los años-fondo: $\frac{700 \cdot 6 + 150 \cdot (-4)}{850} = \frac{4200 - 600}{850} = 4.2$ % anual.
4. Sesgo de supervivencia: $6 - 4.2 = 1.8$ puntos porcentuales por año.
5. Un inversionista que eligió un fondo al azar al inicio de la década esperaba 4.2 %, no 6 %.

:::figura[Empresas emergentes de una incubadora: solo se observan las que siguen operando y su crecimiento promedio exagera el de todas las que empezaron.]{componente="SamplingProcess"}
```yaml
modo: supervivencia
unidades: 50
periodos: 8
media: 0.05
dispersion: 0.08
volatilidad: 0.3
umbral: 0.5
nombreUnidad: Empresa
nombrePeriodo: Año
variable: Crecimiento anual de ventas
```
:::

## Propiedades

- **El sesgo existe solo si la salida depende del resultado**: si los fondos cerraran al azar, los sobrevivientes serían una muestra representativa.
- **Crece con la duración del periodo**: cuantos más periodos, más filtrado acumulado.
- **Crece con la dispersión de los resultados**: con más volatilidad, más unidades cruzan el umbral y más diferencia hay entre las que quedan y las que salen.
- **Afecta también a las relaciones**: entre sobrevivientes, dos características que ayudan a sobrevivir pueden parecer negativamente asociadas aunque no lo estén en la población.

:::figura[Propiedad sin filtro: con el umbral en 0 ningún fondo cierra y el promedio de los sobrevivientes coincide con el de todos.]{componente="SamplingProcess"}
```yaml
modo: supervivencia
unidades: 60
periodos: 10
media: 0.03
dispersion: 0.03
volatilidad: 0.15
umbral: 0
nombreUnidad: Fondo
nombrePeriodo: Año
variable: Rendimiento anual
```
:::

## Errores comunes

- **Estudiar solo casos de éxito para encontrar sus causas.** Si las empresas que fracasaron hacían lo mismo, la característica no explica el éxito.
- **Comparar el rendimiento de los fondos vigentes con un índice de mercado** y concluir que la gestión activa supera al mercado; la comparación omite a los fondos que cerraron.
- **Interpretar la ausencia de daño en los sobrevivientes como zonas sin importancia**, como en los aviones que regresan sin impactos en el motor: los que recibieron esos impactos no regresaron.

:::figura[Error de estudiar solo los éxitos: con mucha volatilidad y un umbral alto, menos de la mitad de los restaurantes sobrevive y su crecimiento promedio es mucho mayor que el del grupo completo.]{componente="SamplingProcess"}
```yaml
modo: supervivencia
unidades: 80
periodos: 6
media: 0.02
dispersion: 0.05
volatilidad: 0.35
umbral: 0.75
nombreUnidad: Restaurante
nombrePeriodo: Año
variable: Crecimiento anual de clientes
```
:::

## Conexiones

El sesgo de supervivencia es un [[sesgo-de-seleccion]] en el que el filtro actúa con el tiempo y depende del resultado. Se parece al [[sesgo-de-no-respuesta]], donde quien falta es quien no contesta. En análisis de supervivencia y en series financieras se trata con modelos para datos censurados y con bases que conservan las unidades extintas. Puede producir asociaciones engañosas del mismo tipo que la [[paradoja-de-simpson]].

## Formulario

:::formula[Sesgo de supervivencia]
$$
\operatorname{Sesgo} = \mathbb{E}[r \mid D = 1] - \mathbb{E}[r]
$$

- $r$: resultado de una unidad.
- $D = 1$: la unidad sobrevivió al periodo de estudio.
:::

:::formula[Promedio de todos los periodos observados]
$$
\bar{r}_{\text{todos}} = \frac{\sum_{i=1}^{N} \sum_{t=1}^{T_i} r_{it}}{\sum_{i=1}^{N} T_i}
$$

- $r_{it}$: resultado de la unidad $i$ en el periodo $t$.
- $T_i$: periodos que la unidad $i$ estuvo activa.
:::

:::formula[Regla de cierre de la visualización]
$$
V_{it} = \prod_{s=1}^{t}(1 + r_{is}), \qquad \text{la unidad cierra si } V_{it} < c
$$

- $V_{it}$: valor acumulado de la unidad $i$ al final del periodo $t$.
- $c$: umbral de cierre.
:::
