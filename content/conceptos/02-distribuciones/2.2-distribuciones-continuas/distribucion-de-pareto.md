---
id: distribucion-de-pareto
titulo: Distribución de Pareto
titulo_en: Pareto distribution
alias:
  - Pareto
  - ley de potencia
  - regla 80/20
modulo: 2
submodulo: '2.2'
orden: 18
nivel: basico
prerrequisitos:
  - distribucion-exponencial
relaciones:
  - tipo: relacionado
    id: distribucion-de-zipf
  - tipo: contrasta
    id: distribucion-lognormal
etiquetas:
  - distribución continua
  - colas pesadas
  - ley de potencia
  - desigualdad
resumen: >
  Distribución con cola de ley de potencia: la probabilidad de superar x cae como x elevado a -α.
  Describe riquezas, tamaños de ciudades o de archivos, donde unos pocos casos acaparan buena parte del total.
formula: 'P(X > x) = \left(\frac{x_m}{x}\right)^{\alpha}, \quad x \ge x_m'
visualizacion:
  componente: DistributionStudio
  parametros:
    explorador:
      distribucion: pareto
      valores:
        xm: 1
        alpha: 1.16
      dominio: [0, 15]
      casos:
        - nombre: 'Regla 80/20'
          descripcion: 'α = 1.16: el 20 % superior concentra el 80 % del total; media finita pero varianza infinita.'
          valores: {xm: 1, alpha: 1.16}
        - nombre: 'Tamaño de archivos'
          descripcion: 'α = 2.5: la cola sigue siendo pesada, pero la media y la varianza existen.'
          valores: {xm: 1, alpha: 2.5}
        - nombre: 'Cola extrema'
          descripcion: 'α = 0.8: la cola es tan pesada que la media es infinita; la media muestral no se estabiliza.'
          valores: {xm: 1, alpha: 0.8}
      ejemplo:
        titulo: 'Grandes fortunas'
        contexto: 'La riqueza de los hogares con al menos un millón sigue una Pareto con mínimo 1 y índice 1.16.'
        pregunta: '¿Qué proporción tiene más de 10 millones?'
        valores: {xm: 1, alpha: 1.16}
        region: derecha
        desde: 10
    genesis:
      componente: ContinuousGenesis
      parametros:
        proceso: potencia-de-uniforme
        valores:
          xm: 1
          alpha: 1.5
referencias:
  - clave: newman
  - clave: coles
publicado: true
---

## Intuición

Vilfredo Pareto observó a fines del siglo XIX que en varios países la riqueza se repartía de forma muy desigual y con un patrón regular: la proporción de personas con una fortuna mayor que cierto monto caía como una potencia de ese monto. Duplicar el umbral dividía la proporción siempre por el mismo factor, sin importar si se partía de un millón o de cien millones. Esa regularidad es la distribución de Pareto.

La consecuencia es una cola pesada: valores enormes son raros, pero no tanto como en una exponencial o una normal. En una Pareto, entre quienes superan un millón, la proporción que supera dos millones es la misma que, entre quienes superan diez, la de quienes superan veinte. No hay una escala típica más allá del mínimo.

Con el índice adecuado aparece la famosa regla 80/20: el 20 % más rico concentra el 80 % de la riqueza. Las leyes de potencia también describen tamaños de ciudades, de empresas, de archivos en un servidor o de reclamaciones de seguros. Cuando el índice es pequeño, la media o la varianza ni siquiera existen.

## Definición

:::definicion[Distribución de Pareto]
Una variable $X$ tiene **distribución de Pareto** con mínimo $x_m > 0$ e índice de cola $\alpha > 0$, $X \sim \operatorname{Pareto}(x_m, \alpha)$, si
$$
P(X > x) = \left(\frac{x_m}{x}\right)^{\alpha}, \qquad f(x) = \frac{\alpha x_m^{\alpha}}{x^{\alpha + 1}}, \qquad x \ge x_m.
$$
:::

**Construcción:** si $U \sim U(0, 1)$, entonces $x_m U^{-1/\alpha} \sim \operatorname{Pareto}(x_m, \alpha)$. Equivalentemente, $\log(X/x_m)$ es exponencial con tasa $\alpha$.

:::nota[Qué es X]
$X$ = una magnitud con cola de ley de potencia, como un ingreso, el tamaño de una ciudad o una pérdida asegurada.
:::

:::nota[Qué hace cada parámetro]
- **$x_m$, valor mínimo:** el menor valor posible, que fija la escala. Si aumenta, toda la curva se estira a la derecha.
- **$\alpha$, índice de cola:** qué tan pesada es la cola. Si aumenta, la cola se adelgaza y los valores enormes se vuelven raros.
:::

:::nota[Qué significa cada símbolo]
- $X$: magnitud, como un ingreso o un tamaño.
- $x_m$: valor mínimo posible, la escala.
- $\alpha$: índice de cola; cuanto menor, más pesada la cola.
- $P(X > x)$: proporción que supera $x$.
- $U$: uniforme estándar.
:::

## Cómo usar la visualización

La pestaña Distribución muestra la densidad de Pareto, la región elegida y su probabilidad; los casos cargan índices de cola distintos y el ejemplo de la ficha se carga con su botón. La pestaña Ver cómo surge transforma una uniforme en $x_m U^{-1/\alpha}$: casi siempre sale un valor modesto y de vez en cuando uno enorme.

Con el caso de la cola extrema, el botón de simulación produce medias muestrales que cambian bruscamente al llegar un valor gigante. En la región desde $a$, duplicar $a$ divide la probabilidad siempre entre $2^{\alpha}$.

## Ejemplo

La riqueza de los hogares con al menos un millón de pesos sigue una Pareto con $x_m = 1$ millón y $\alpha = 1.16$, el índice que corresponde a la regla 80/20.

1. Proporción con más de 2 millones: $(1/2)^{1.16} \approx 0.448$.
2. Proporción con más de 10 millones: $(1/10)^{1.16} \approx 0.069$.
3. Riqueza mediana: $x_m 2^{1/\alpha} = 2^{0.862} \approx 1.82$ millones.
4. Riqueza media: $\frac{\alpha x_m}{\alpha - 1} = \frac{1.16}{0.16} = 7.25$ millones, cuatro veces la mediana; la varianza es infinita porque $\alpha < 2$.

:::figura[Pareto(1, 1.16): el área sombreada de 10 millones en adelante vale 0.069; la cola es larga y la media queda muy a la derecha de la mediana.]{componente="DistributionExplorer"}
```yaml
distribucion: pareto
valores:
  xm: 1
  alpha: 1.16
dominio: [0, 15]
ejemplo:
  titulo: 'Grandes fortunas'
  contexto: 'La riqueza de los hogares con al menos un millón sigue una Pareto con mínimo 1 y índice 1.16.'
  pregunta: '¿Qué proporción tiene más de 10 millones?'
  valores: {xm: 1, alpha: 1.16}
  region: derecha
  desde: 10
region: derecha
desde: 10
muestras: false
```
:::

## Propiedades

- **Media:** $\frac{\alpha x_m}{\alpha - 1}$ si $\alpha > 1$; infinita si $\alpha \le 1$.
- **Varianza:** $\frac{\alpha x_m^{2}}{(\alpha - 1)^{2}(\alpha - 2)}$ si $\alpha > 2$; infinita si $\alpha \le 2$.
- **Autosemejanza:** $P(X > cx \mid X > x) = c^{-\alpha}$ no depende de $x$; condicionar a superar un umbral produce otra Pareto con mínimo igual al umbral.
- **Línea en escala log-log:** $\log P(X > x)$ es lineal en $\log x$ con pendiente $-\alpha$.
- **Relación con la exponencial:** $\log(X/x_m) \sim \operatorname{Exp}(\alpha)$.
- **Concentración:** la fracción del total que acapara el $p$ superior es $p^{1 - 1/\alpha}$ si $\alpha > 1$; con $\alpha = 1.16$ el 20 % superior concentra el 80 %.

:::figura[Tres casos con contexto (regla 80/20, tamaño de archivos, cola extrema): cada botón carga los parámetros y una frase explica por qué la forma es así.]{componente="DistributionExplorer"}
```yaml
distribucion: pareto
valores:
  xm: 1
  alpha: 1.16
dominio: [0, 15]
casos:
  - nombre: 'Regla 80/20'
    descripcion: 'α = 1.16: el 20 % superior concentra el 80 % del total; media finita pero varianza infinita.'
    valores: {xm: 1, alpha: 1.16}
  - nombre: 'Tamaño de archivos'
    descripcion: 'α = 2.5: la cola sigue siendo pesada, pero la media y la varianza existen.'
    valores: {xm: 1, alpha: 2.5}
  - nombre: 'Cola extrema'
    descripcion: 'α = 0.8: la cola es tan pesada que la media es infinita; la media muestral no se estabiliza.'
    valores: {xm: 1, alpha: 0.8}
```
:::

:::figura[Potencia de una uniforme: cada resultado transforma una U en x_m U^(-1/α); casi siempre sale un valor modesto y a veces uno enorme.]{componente="ContinuousGenesis"}
```yaml
proceso: potencia-de-uniforme
valores:
  xm: 1
  alpha: 1.5
```
:::

:::figura[Efecto del índice: con α = 3 (curva) la cola cae rápido; con α = 0.8 (línea punteada) la cola es tan pesada que la media no existe.]{componente="DistributionExplorer"}
```yaml
distribucion: pareto
valores:
  xm: 1
  alpha: 3
dominio: [0, 8]
muestras: false
referencia:
  distribucion: pareto
  valores:
    xm: 1
    alpha: 0.8
  etiqueta: Índice 0.8
```
:::

## Errores comunes

- **Usar la media muestral como resumen.** Con $\alpha$ cercano a 1 la media muestral es muy inestable y depende de unos pocos valores extremos.
- **Calcular desviaciones estándar con α ≤ 2.** La varianza teórica es infinita; la muestral crece sin control.
- **Ajustar toda la distribución con una Pareto.** Muchas veces solo la cola superior sigue una ley de potencia; el cuerpo se parece más a una lognormal.
- **Confundir el índice con la pendiente de la densidad.** En escala log-log la función de supervivencia tiene pendiente $-\alpha$ y la densidad, $-(\alpha + 1)$.

:::figura[Cola de ley de potencia frente a cola exponencial: la Pareto (curva) y la exponencial de la misma media (línea punteada) se cruzan cerca de 8.6. Antes manda la exponencial, pero más allá de 12 la Pareto conserva casi tres veces más masa: 0.0069 frente a 0.0025.]{componente="DistributionExplorer"}
```yaml
distribucion: pareto
valores:
  xm: 1
  alpha: 2
dominio: [0, 20]
region: derecha
desde: 12
muestras: false
referencia:
  distribucion: exponencial
  valores:
    lambda: 0.5
  etiqueta: Exponencial de media 2
```
:::

## Conexiones

La Pareto es la exponencial de una [[distribucion-exponencial]] reescalada, y su versión discreta para rangos es la [[distribucion-de-zipf]]. Se contrasta con la [[distribucion-lognormal]], con la que a menudo se confunde en datos de ingresos. Es la cola típica de la [[distribucion-de-frechet]], que describe máximos de variables de cola pesada, y un ejemplo de las distribuciones de colas pesadas que rompen el teorema central del límite cuando $\alpha < 2$. El [[mapa-de-relaciones-entre-distribuciones]] la sitúa entre las demás distribuciones.

## Formulario

:::formula[Supervivencia y densidad]
$$
P(X > x) = \left(\frac{x_m}{x}\right)^{\alpha}, \qquad f(x) = \frac{\alpha x_m^{\alpha}}{x^{\alpha + 1}}, \qquad x \ge x_m
$$

- $x_m$: mínimo.
- $\alpha$: índice de cola.
:::

:::formula[Media, varianza y mediana]
$$
\mathbb{E}[X] = \frac{\alpha x_m}{\alpha - 1}, \qquad \operatorname{Var}(X) = \frac{\alpha x_m^{2}}{(\alpha - 1)^{2}(\alpha - 2)}, \qquad \operatorname{mediana} = x_m 2^{1/\alpha}
$$

- La media requiere $\alpha > 1$ y la varianza $\alpha > 2$.
:::

:::formula[Construcción]
$$
X = x_m U^{-1/\alpha}, \qquad U \sim U(0, 1)
$$

- $U$: uniforme estándar.
:::

:::formula[Concentración del total]
$$
\text{fracción del total en el } p \text{ superior} = p^{1 - 1/\alpha}
$$

- $p$: proporción superior de la población, con $\alpha > 1$.
:::
