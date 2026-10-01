---
id: distribucion-gamma-inversa
titulo: Distribución gamma inversa
titulo_en: Inverse gamma distribution
alias:
  - gamma inversa
  - inversa de la gamma
  - Inv-Gamma(α, β)
modulo: 2
submodulo: '2.2'
orden: 27
nivel: intermedio
prerrequisitos:
  - distribucion-gamma
relaciones:
  - tipo: relacionado
    id: distribucion-t-de-student
etiquetas:
  - distribución continua
  - varianzas
  - estadística bayesiana
  - cola pesada
resumen: >
  Es la distribución del recíproco de una variable gamma. Tiene cola derecha de ley de potencia y se usa
  como distribución inicial para varianzas en estadística bayesiana.
formula: 'f(x) = \frac{\beta^{\alpha}}{\Gamma(\alpha)}\, x^{-\alpha - 1} e^{-\beta/x}, \quad x > 0'
visualizacion:
  componente: DistributionStudio
  parametros:
    explorador:
      distribucion: gamma-inversa
      valores:
        alpha: 4
        beta: 6
      casos:
        - nombre: 'Varianza poco informada'
          descripcion: 'α = 1.5 y β = 1: la cola derecha es tan pesada que la varianza no existe; refleja mucha incertidumbre sobre la escala.'
          valores: {alpha: 1.5, beta: 1}
        - nombre: 'Varianza de un instrumento'
          descripcion: 'α = 4 y β = 6: la varianza del error ronda 2, con cola hacia valores mayores.'
          valores: {alpha: 4, beta: 6}
        - nombre: 'Varianza bien conocida'
          descripcion: 'α = 11 y β = 10: con mucha información previa, concentrada alrededor de 1.'
          valores: {alpha: 11, beta: 10}
      ejemplo:
        titulo: 'Error de un instrumento'
        contexto: 'La incertidumbre sobre la varianza del error de un instrumento se describe con una gamma inversa con α = 4 y β = 6.'
        pregunta: '¿Qué probabilidad se asigna a que la varianza supere 3?'
        valores: {alpha: 4, beta: 6}
        region: derecha
        desde: 3
    genesis:
      componente: ContinuousGenesis
      parametros:
        proceso: inverso-gamma
        valores:
          alpha: 4
          beta: 6
referencias:
  - clave: gelman-bda
    capitulo: '2'
  - clave: murphy
publicado: true
---

## Intuición

Un laboratorio no conoce con exactitud la varianza del error de su instrumento, pero sí sabe que es positiva, que probablemente ronda cierto valor y que podría ser bastante mayor. Para describir esa incertidumbre con una distribución, la gamma inversa es la elección habitual: vive en los positivos, tiene un pico moderado y una cola derecha larga.

Su nombre lo dice todo: si una tasa o una precisión sigue una gamma, su recíproco sigue una gamma inversa. Como la gamma pone mucha masa cerca de cero, el recíproco pone masa en valores grandes, y la cola resultante es de ley de potencia. Con pocos grados de información la cola es tan pesada que la media o la varianza no existen.

En estadística bayesiana tiene una propiedad muy útil: cuando los datos son normales con varianza desconocida, una gamma inversa como distribución inicial para la varianza produce, después de ver los datos, otra gamma inversa. Además, mezclar normales cuya varianza sigue una gamma inversa produce la $t$ de Student.

## Definición

:::definicion[Distribución gamma inversa]
Si $G \sim \operatorname{Gamma}(\alpha, \beta)$ con forma $\alpha > 0$ y tasa $\beta > 0$, entonces $X = 1/G$ tiene **distribución gamma inversa**, $X \sim \operatorname{Inv\text{-}Gamma}(\alpha, \beta)$, con densidad
$$
f(x) = \frac{\beta^{\alpha}}{\Gamma(\alpha)}\, x^{-\alpha - 1} e^{-\beta/x}, \qquad x > 0.
$$
:::

:::nota[Qué es X]
$X$ = una cantidad positiva con cola derecha pesada, típicamente una varianza desconocida.
:::

:::nota[Qué hace cada parámetro]
- **$\alpha$, forma:** controla la cola derecha y qué momentos existen. Si aumenta, la cola se adelgaza y la curva se concentra.
- **$\beta$, escala:** el tamaño típico de $X$. Si aumenta, la curva se estira a la derecha.
:::

:::nota[Qué significa cada símbolo]
- $X$: cantidad positiva, típicamente una varianza.
- $G$: variable gamma cuyo recíproco es $X$.
- $\alpha$: forma; controla la cola derecha.
- $\beta$: escala de $X$ (es la tasa de $G$).
- $\Gamma(\alpha)$: función gamma.
:::

## Cómo usar la visualización

La pestaña Distribución muestra la densidad gamma inversa, la región elegida y su probabilidad; los casos cargan una varianza poco informada, una moderada y una bien conocida, y el ejemplo de la ficha se carga con su botón. La pestaña Ver cómo surge sortea una gamma y toma su recíproco: los valores de la gamma cercanos a cero producen los valores grandes de la cola.

Con $\alpha = 1.5$ la media existe pero la varianza no, y la simulación produce de vez en cuando valores muy grandes. Al subir $\alpha$ y $\beta$ juntos la distribución se concentra.

## Ejemplo

La varianza del error de un instrumento tiene distribución $\operatorname{Inv\text{-}Gamma}(4, 6)$.

1. Media: $\beta/(\alpha - 1) = 6/3 = 2$.
2. Moda: $\beta/(\alpha + 1) = 6/5 = 1.2$, menor que la media por la cola derecha.
3. Varianza: $\frac{\beta^{2}}{(\alpha - 1)^{2}(\alpha - 2)} = \frac{36}{9 \cdot 2} = 2$.
4. Probabilidad de que la varianza supere 3: $P(X > 3) \approx 0.143$; el cuantil 0.95 es 4.39.

:::figura[Error del instrumento: el área sombreada a la derecha de 3 vale 0.143. El botón carga el ejemplo.]{componente="DistributionExplorer"}
```yaml
distribucion: gamma-inversa
valores:
  alpha: 4
  beta: 6
ejemplo:
  titulo: 'Error de un instrumento'
  contexto: 'La varianza del error de un instrumento tiene distribución gamma inversa con α = 4 y β = 6.'
  pregunta: '¿Qué probabilidad se asigna a que la varianza supere 3?'
  valores: {alpha: 4, beta: 6}
  region: derecha
  desde: 3
region: derecha
desde: 3
probabilidad: 0.95
muestras: false
```
:::

## Propiedades

- **Media:** $\beta/(\alpha - 1)$ si $\alpha > 1$.
- **Varianza:** $\frac{\beta^{2}}{(\alpha - 1)^{2}(\alpha - 2)}$ si $\alpha > 2$.
- **Moda:** $\beta/(\alpha + 1)$.
- **Cola:** $P(X > x) \sim c\,x^{-\alpha}$, una ley de potencia con índice $\alpha$.
- **Conjugación:** con datos normales de media conocida, una inicial $\operatorname{Inv\text{-}Gamma}(\alpha, \beta)$ para la varianza se actualiza a $\operatorname{Inv\text{-}Gamma}\!\left(\alpha + \frac{n}{2}, \beta + \frac{1}{2}\sum (x_i - \mu)^{2}\right)$.
- **Mezcla con la normal:** si $\sigma^{2} \sim \operatorname{Inv\text{-}Gamma}(\nu/2, \nu/2)$ y $X \mid \sigma^{2} \sim \mathcal{N}(0, \sigma^{2})$, entonces $X \sim t_{\nu}$.

:::figura[Tres casos con contexto (varianza poco informada, instrumento y varianza bien conocida): cada botón carga los parámetros y una frase explica por qué la forma es así.]{componente="DistributionExplorer"}
```yaml
distribucion: gamma-inversa
valores:
  alpha: 4
  beta: 6
casos:
  - nombre: 'Varianza poco informada'
    descripcion: 'α = 1.5: cola tan pesada que la varianza no existe.'
    valores: {alpha: 1.5, beta: 1}
  - nombre: 'Varianza de un instrumento'
    descripcion: 'α = 4 y β = 6: media 2, moda 1.2.'
    valores: {alpha: 4, beta: 6}
  - nombre: 'Varianza bien conocida'
    descripcion: 'α = 11 y β = 10: concentrada cerca de 1.'
    valores: {alpha: 11, beta: 10}
muestras: false
```
:::

:::figura[Recíproco de una gamma: los valores de G cercanos a cero se vuelven valores grandes de 1/G y forman la cola derecha.]{componente="ContinuousGenesis"}
```yaml
proceso: inverso-gamma
valores:
  alpha: 4
  beta: 6
```
:::

## Errores comunes

- **Confundir tasa y escala.** En la gamma, $\beta$ es tasa; en la gamma inversa resultante, $\beta$ actúa como escala: aumentar $\beta$ desplaza $X$ hacia arriba.
- **Usar iniciales con α y β muy pequeños como "no informativas".** $\operatorname{Inv\text{-}Gamma}(0.001, 0.001)$ concentra masa de forma extraña y puede influir mucho en los resultados con pocos datos.
- **Calcular la media con α ≤ 1.** La media es infinita; hay que usar la mediana.
- **Invertir la media de la gamma.** $\mathbb{E}[1/G] \ne 1/\mathbb{E}[G]$: con $\alpha = 4$, $\beta = 6$, $1/\mathbb{E}[G] = 1.5$ pero $\mathbb{E}[1/G] = 2$.

:::figura[El inverso de la media no es la media del inverso: la gamma de tasa 6 (línea punteada) tiene media 0.67, y su recíproco no tiene media 1.5 sino 2.]{componente="DistributionExplorer"}
```yaml
distribucion: gamma-inversa
valores:
  alpha: 4
  beta: 6
rangos:
  beta: [0.2, 10]
dominio: [0, 6]
muestras: false
referencia:
  distribucion: gamma
  valores:
    alpha: 4
    beta: 6
  etiqueta: 'Gamma(4, tasa 6), media 0.67'
```
:::

## Conexiones

La gamma inversa es el recíproco de la [[distribucion-gamma]]. Mezclar normales con varianza gamma inversa da la [[distribucion-t-de-student]], y su cola es de ley de potencia como la de la [[distribucion-de-pareto]]. Es la inicial conjugada de la varianza de una [[distribucion-normal]] y su versión matricial es la Wishart inversa. El [[mapa-de-relaciones-entre-distribuciones]] la sitúa entre las demás distribuciones.

## Formulario

:::formula[Densidad]
$$
f(x) = \frac{\beta^{\alpha}}{\Gamma(\alpha)}\, x^{-\alpha - 1} e^{-\beta/x}, \qquad x > 0
$$

- $\alpha$: forma; $\beta$: escala.
- $\Gamma$: función gamma.
:::

:::formula[Momentos y moda]
$$
\mathbb{E}[X] = \frac{\beta}{\alpha - 1}, \qquad \operatorname{Var}(X) = \frac{\beta^{2}}{(\alpha - 1)^{2}(\alpha - 2)}, \qquad \operatorname{moda} = \frac{\beta}{\alpha + 1}
$$

- Requieren $\alpha > 1$ y $\alpha > 2$.
:::

:::formula[Actualización conjugada]
$$
\sigma^{2} \mid \mathbf{x} \sim \operatorname{Inv\text{-}Gamma}\!\left(\alpha + \frac{n}{2},\ \beta + \frac{1}{2}\sum_{i=1}^{n}(x_i - \mu)^{2}\right)
$$

- $\mathbf{x}$: datos normales con media conocida $\mu$.
- $n$: número de datos.
:::
