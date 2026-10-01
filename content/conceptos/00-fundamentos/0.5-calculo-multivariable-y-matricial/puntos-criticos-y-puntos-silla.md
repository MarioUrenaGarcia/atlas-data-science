---
id: puntos-criticos-y-puntos-silla
titulo: Puntos críticos y puntos silla
titulo_en: Critical points and saddle points
alias:
  - puntos estacionarios
  - prueba de la segunda derivada en varias variables
  - punto de silla
modulo: 0
submodulo: '0.5'
orden: 10
nivel: intermedio
prerrequisitos:
  - matriz-hessiana
  - maximos-y-minimos
etiquetas:
  - puntos críticos
  - punto silla
  - extremos locales
  - optimización
resumen: >
  Un punto crítico es donde el gradiente se anula; la hessiana decide si es un mínimo, un máximo o un punto
  silla, que sube en unas direcciones y baja en otras.
formula: '\nabla f(\mathbf{x}^*) = \mathbf{0}, \qquad D = f_{xx}f_{yy} - f_{xy}^2'
visualizacion:
  componente: SurfaceViz
  parametros:
    modo: criticos
    campos: [min-y-silla, dos-colinas, ondas]
referencias:
  - clave: boyd
  - clave: goodfellow
    capitulo: '4.3'
publicado: true
---

## Intuición

En una sola variable, los lugares donde la tangente es horizontal son cimas, fondos o puntos de inflexión. En dos variables aparece una posibilidad nueva y muy común: el punto silla, como el centro de una silla de montar o el collado entre dos montañas. Ahí el terreno es plano, pero en la dirección del camino que cruza las montañas es el punto más alto, y en la dirección de la cresta es el más bajo.

Un punto crítico es cualquier lugar donde el plano tangente es horizontal, es decir, donde el gradiente se anula. Para saber de qué tipo es, se mira la curvatura en todas las direcciones con la hessiana: si curva hacia arriba en todas, es un mínimo; si hacia abajo en todas, un máximo; si en unas sube y en otras baja, una silla. En los modelos de aprendizaje profundo, con millones de parámetros, la mayoría de los puntos críticos son sillas, y saber escapar de ellas es parte del arte de optimizar.

## Definición

:::definicion[Punto crítico]
Un punto $\mathbf{x}^*$ interior al dominio de $f$ es un **punto crítico** (o estacionario) si $f$ es diferenciable ahí y $\nabla f(\mathbf{x}^*) = \mathbf{0}$. Es un **mínimo local** si $f(\mathbf{x}) \ge f(\mathbf{x}^*)$ para todo $\mathbf{x}$ cercano, un **máximo local** si $f(\mathbf{x}) \le f(\mathbf{x}^*)$, y un **punto silla** si no es ninguno de los dos.
:::

:::teorema[Prueba de la segunda derivada]
Sea $\mathbf{x}^*$ un punto crítico con hessiana $\mathbf{H} = \mathbf{H}_f(\mathbf{x}^*)$ continua alrededor.
- Si $\mathbf{H}$ es definida positiva (todos sus valores propios son positivos), $\mathbf{x}^*$ es un mínimo local.
- Si $\mathbf{H}$ es definida negativa, es un máximo local.
- Si $\mathbf{H}$ tiene valores propios positivos y negativos, es un punto silla.
- Si algún valor propio es 0 y los demás no cambian de signo, la prueba no decide.
:::

En dos variables, con $D = \det \mathbf{H} = f_{xx}f_{yy} - f_{xy}^2$: si $D > 0$ y $f_{xx} > 0$, mínimo; si $D > 0$ y $f_{xx} < 0$, máximo; si $D < 0$, silla; si $D = 0$, no se decide.

:::nota[Qué significa cada símbolo]
- $\mathbf{x}^*$: punto crítico candidato.
- $\nabla f(\mathbf{x}^*)$: gradiente en ese punto; $\mathbf{0}$ es el vector cero.
- $\mathbf{H}$: hessiana de $f$ en $\mathbf{x}^*$.
- $D$: determinante de la hessiana en dos variables.
- $f_{xx}, f_{yy}, f_{xy}$: segundas derivadas parciales en $\mathbf{x}^*$.
:::

## Cómo usar la visualización

El mapa de curvas de nivel y la superficie muestran todos los puntos críticos de la ventana, encontrados numéricamente y coloreados por tipo: verde los mínimos, naranja los máximos y amarillo las sillas. La reproducción visita cada uno; el encabezado muestra su hessiana, sus valores propios, su determinante y la clasificación que resulta. El selector cambia la función y los controles giran la cámara.

En $x^3 - 3x + y^2$ hay dos puntos: un mínimo, rodeado por óvalos, y una silla, donde la curva de su nivel se cruza en forma de X. Con las ondas aparecen muchos puntos, con máximos y mínimos alternados y sillas entre ellos.

## Ejemplo

La pérdida de un modelo con dos parámetros es $f(x, y) = x^3 - 3x + y^2$. Se buscan y clasifican sus puntos críticos.

1. Gradiente: $\nabla f = (3x^2 - 3,\ 2y)$.
2. $\nabla f = \mathbf{0}$ exige $x^2 = 1$ y $y = 0$: los puntos son $(1, 0)$ y $(-1, 0)$.
3. Hessiana: $\mathbf{H} = \begin{pmatrix} 6x & 0 \\ 0 & 2 \end{pmatrix}$.
4. En $(1, 0)$: $\mathbf{H} = \begin{pmatrix} 6 & 0 \\ 0 & 2 \end{pmatrix}$, con $D = 12 > 0$ y $f_{xx} = 6 > 0$: mínimo local, con $f(1, 0) = -2$.
5. En $(-1, 0)$: $\mathbf{H} = \begin{pmatrix} -6 & 0 \\ 0 & 2 \end{pmatrix}$, con $D = -12 < 0$: punto silla, con $f(-1, 0) = 2$. Baja en la dirección de $x$ y sube en la de $y$.
6. El mínimo es solo local: $f(x, 0) = x^3 - 3x$ tiende a $-\infty$ cuando $x \to -\infty$, así que no hay mínimo global.

:::figura[Los dos puntos críticos del ejemplo: el mínimo en (1, 0), rodeado de óvalos de nivel, y la silla en (-1, 0), donde la curva de nivel 2 se cruza consigo misma.]{componente="SurfaceViz"}
```yaml
modo: criticos
campos: [min-y-silla]
```
:::

## Propiedades

- **Condición necesaria:** todo extremo local interior de una función diferenciable es un punto crítico; el recíproco es falso.
- **Extremos en la frontera:** en un dominio cerrado, el máximo y el mínimo pueden estar en la frontera, donde el gradiente no tiene que anularse; ahí se usan [[multiplicadores-de-lagrange]].
- **Funciones convexas:** si $f$ es convexa, todo punto crítico es un mínimo global.
- **Sillas en dimensión alta:** con $n$ variables una silla tiene valores propios de ambos signos; en problemas grandes esto es mucho más frecuente que tenerlos todos del mismo signo.

:::figura[En sen x cos y los puntos críticos forman un patrón regular: máximos de valor 1 y mínimos de valor -1 alternados, con sillas entre ellos sobre las líneas donde la función vale 0.]{componente="SurfaceViz"}
```yaml
modo: criticos
campos: [ondas]
```
:::

## Errores comunes

- **Concluir que todo punto con gradiente cero es un extremo.** En $x^2 - y^2$ el origen tiene gradiente cero y es una silla.
- **Clasificar solo con $f_{xx}$.** $f_{xx} > 0$ dice que el corte en $x$ curva hacia arriba, pero si $D < 0$ hay otra dirección que curva hacia abajo.
- **Confundir local con global.** Un mínimo local puede no ser el menor valor de la función, como en el ejemplo.
- **Aplicar la prueba con $D = 0$.** $x^4 + y^4$ y $x^4 - y^4$ tienen hessiana nula en el origen; la primera tiene ahí un mínimo y la segunda una silla.

:::figura[La silla x² - y²: un único punto crítico, en el origen, con gradiente cero y valores propios 2 y -2. No es máximo ni mínimo: sube hacia los lados y baja hacia el frente.]{componente="SurfaceViz"}
```yaml
modo: criticos
campos: [silla]
```
:::

## Conexiones

Generaliza los [[maximos-y-minimos]] de una variable usando el [[gradiente]] y la [[matriz-hessiana]]. La clasificación depende de si la hessiana está entre las [[matrices-definidas-positivas-y-semidefinidas]]. Las [[curvas-de-nivel]] muestran el tipo de cada punto. Con restricciones se pasa a los [[multiplicadores-de-lagrange]] y a las [[condiciones-de-karush-kuhn-tucker]].

## Formulario

:::formula[Condición de punto crítico]
$$
\nabla f(\mathbf{x}^*) = \mathbf{0}
$$

- $\mathbf{x}^*$: punto interior del dominio.
- $\nabla f$: gradiente.
:::

:::formula[Determinante de la prueba en dos variables]
$$
D = f_{xx}f_{yy} - f_{xy}^2
$$

- $D > 0$, $f_{xx} > 0$: mínimo local.
- $D > 0$, $f_{xx} < 0$: máximo local.
- $D < 0$: punto silla. $D = 0$: no se decide.
:::

:::formula[Prueba con valores propios]
$$
\mathbf{H}_f(\mathbf{x}^*) \succ 0 \Rightarrow \text{mínimo}, \qquad \mathbf{H}_f(\mathbf{x}^*) \prec 0 \Rightarrow \text{máximo}
$$

- $\succ 0$: definida positiva, todos los valores propios positivos.
- $\prec 0$: definida negativa, todos negativos.
- Valores propios de ambos signos: punto silla.
:::
