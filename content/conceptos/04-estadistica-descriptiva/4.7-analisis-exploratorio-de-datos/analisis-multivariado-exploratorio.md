---
id: analisis-multivariado-exploratorio
titulo: Análisis multivariado exploratorio
titulo_en: Exploratory multivariate analysis
alias:
  - exploración de varias variables
  - condicionamiento gráfico
modulo: 4
submodulo: '4.7'
orden: 4
nivel: basico
prerrequisitos:
  - analisis-bivariado
  - matriz-de-correlacion
  - matriz-de-diagramas-de-dispersion
relaciones:
  - tipo: relacionado
    id: correlacion-parcial
etiquetas:
  - exploración
  - varias variables
  - condicionamiento
  - múltiplos pequeños
resumen: >
  El análisis multivariado exploratorio mira tres o más variables a la vez: una tercera variable como
  color o como paneles separados, y matrices de correlación o de dispersión, para descubrir relaciones
  que cambian entre grupos.
formula: 'r_{XY \mid g} = \operatorname{corr}(X, Y \mid G = g),\qquad g = 1, \dots, G'
visualizacion:
  componente: EdaWorkflow
  parametros:
    modo: multivariado
    vista: color
referencias:
  - clave: james-isl
    capitulo: '2'
  - clave: tufte
publicado: true
---

## Intuición

En las ventas de viviendas, superficie y precio se relacionan con una correlación de 0.69 en escala logarítmica. Pero esa nube mezcla tres zonas con precios por metro cuadrado muy distintos. Si cada punto se colorea según su zona, la nube se separa en tres bandas paralelas, y dentro de cada banda la relación es mucho más estrecha: la correlación sube a 0.87 en el Norte, 0.90 en el Centro y 0.81 en el Sur. Parte de lo que parecía ruido era la zona.

El **análisis multivariado exploratorio** agrega una tercera variable, o más, a las gráficas de dos. Hay tres recursos básicos: codificar la tercera variable con color o tamaño, separar los datos en paneles pequeños, uno por cada valor de la tercera variable (múltiplos pequeños o condicionamiento), y resumir muchas variables a la vez con una matriz de correlaciones o una matriz de diagramas de dispersión. El objetivo es descubrir relaciones que cambian, aparecen o desaparecen al tener en cuenta otras variables.

## Definición

:::definicion[Análisis multivariado exploratorio]
El **análisis multivariado exploratorio** de variables $X_1, \dots, X_p$ ($p \ge 3$) examina relaciones conjuntas mediante:

1. **Codificación adicional:** una tercera variable como color, forma o tamaño en un diagrama de dispersión.
2. **Condicionamiento:** la relación entre $X$ y $Y$ dentro de cada grupo $G = g$, en paneles con escalas comunes, y su resumen
$$
r_{XY \mid g} = \operatorname{corr}(X, Y \mid G = g),\qquad g = 1, \dots, G.
$$
3. **Resúmenes de todos los pares:** la matriz de correlaciones $\mathbf{R}$, con $R_{jk} = \operatorname{corr}(X_j, X_k)$, y la matriz de diagramas de dispersión.
:::

Las correlaciones de la matriz se calculan sobre casos completos, o par por par; en ambos casos se reporta cuántas observaciones se usaron.

:::nota[Qué significa cada símbolo]
- $X_1, \dots, X_p$: las variables; $p$: su número.
- $X$, $Y$: dos variables numéricas cuya relación se estudia.
- $G$: variable de grupo; $g$: uno de sus valores; también $G$ denota el número de grupos en $g = 1, \dots, G$.
- $r_{XY \mid g}$: correlación entre $X$ y $Y$ dentro del grupo $g$.
- $\mathbf{R}$: matriz de correlaciones; $R_{jk}$: correlación entre $X_j$ y $X_k$.
:::

## Cómo usar la visualización

El selector **Vista** ofrece tres formas de ver más de dos variables en las ventas de viviendas, ya sin los dos errores de captura: la zona como color, un panel por zona con escalas comunes, y la matriz de correlaciones de las cuatro variables numéricas. El encabezado compara la correlación de los logaritmos con todas las zonas juntas y dentro de cada zona.

Experimentos sugeridos:

1. En la vista de color, observar las tres bandas paralelas: el Centro arriba, el Sur abajo.
2. En la vista de paneles, comparar la pendiente de las tres nubes: es parecida; lo que cambia es el nivel.
3. En la matriz, ubicar la correlación entre antigüedad y precio: casi cero, en contraste con 0.84 entre superficie y habitaciones.

## Ejemplo

Correlación del logaritmo del precio con el logaritmo de la superficie:

1. Con las 198 viviendas sin errores: $r = 0.689$.
2. Dentro de cada zona: $r_{\text{Norte}} = 0.868$, $r_{\text{Centro}} = 0.904$ y $r_{\text{Sur}} = 0.809$.
3. Las tres correlaciones condicionales superan a la global: mezclar zonas con distintos precios por metro cuadrado agrega dispersión vertical que no tiene que ver con la superficie.
4. Conclusión exploratoria: un modelo del precio debería incluir la superficie y la zona.

:::figura[Las tres zonas en paneles separados, con las mismas escalas: la relación es estrecha dentro de cada una.]{componente="EdaWorkflow"}
```yaml
modo: multivariado
vista: paneles
```
:::

## Propiedades

- **Las relaciones pueden cambiar al condicionar:** reforzarse, debilitarse o invertirse (paradoja de Simpson).
- **Escalas comunes en los paneles:** permiten comparar niveles y pendientes entre grupos.
- **La matriz de correlaciones resume muchos pares,** pero solo relaciones lineales de dos en dos.

:::figura[Matriz de correlaciones de superficie, habitaciones, antigüedad y precio, sobre casos completos.]{componente="EdaWorkflow"}
```yaml
modo: multivariado
vista: correlaciones
```
:::

## Errores comunes

- **Quedarse con la correlación global.** Si hay grupos, la relación dentro de ellos puede ser muy distinta.
- **Usar escalas distintas en cada panel.** Con ejes propios, dos paneles con niveles muy diferentes parecen iguales.
- **Leer la matriz de correlaciones como causalidad o como relaciones completas.** Una correlación de dos en dos no considera las demás variables; para eso existe la correlación parcial.

:::figura[La relación global sin grupos: correlación más débil porque mezcla zonas con niveles de precio distintos.]{componente="EdaWorkflow"}
```yaml
modo: bivariado
par: superficie-precio
excluirErrores: true
escalaLog: true
```
:::

## Conexiones

El análisis multivariado exploratorio extiende el [[analisis-bivariado]] con la [[matriz-de-correlacion]], la [[matriz-de-diagramas-de-dispersion]] y el [[grafico-de-coordenadas-paralelas]]. La comparación entre la relación global y las condicionales se formaliza con la [[correlacion-parcial]], y la inversión de una relación al condicionar se estudia en la paradoja de Simpson. Es parte del [[analisis-exploratorio-de-datos]].

## Formulario

:::formula[Correlación condicional por grupo]
$$
r_{XY \mid g} = \operatorname{corr}(X, Y \mid G = g)
$$

- $X$, $Y$: variables numéricas; $G$: variable de grupo; $g$: un grupo.
:::

:::formula[Elemento de la matriz de correlaciones]
$$
R_{jk} = \frac{\sum_{i=1}^{n} (x_{ij} - \bar{x}_j)(x_{ik} - \bar{x}_k)}{\sqrt{\sum_{i=1}^{n} (x_{ij} - \bar{x}_j)^2 \sum_{i=1}^{n} (x_{ik} - \bar{x}_k)^2}}
$$

- $x_{ij}$: valor de la variable $j$ en la observación $i$; $\bar{x}_j$: media de la variable $j$; $n$: casos completos.
:::
