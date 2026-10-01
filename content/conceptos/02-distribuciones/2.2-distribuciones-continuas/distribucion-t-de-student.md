---
id: distribucion-t-de-student
titulo: Distribución t de Student
titulo_en: Student's t distribution
alias:
  - t de Student
  - distribución t
  - Student t
modulo: 2
submodulo: '2.2'
orden: 10
nivel: basico
prerrequisitos:
  - distribucion-chi-cuadrada
relaciones:
  - tipo: contrasta
    id: distribucion-normal
etiquetas:
  - distribución continua
  - colas pesadas
  - muestras pequeñas
  - grados de libertad
resumen: >
  Es el cociente entre una normal estándar y la raíz de una chi-cuadrada dividida entre sus grados de
  libertad. Es simétrica como la normal, pero con colas más pesadas cuando hay pocos grados.
formula: 'T = \frac{Z}{\sqrt{V/\nu}} \sim t_{\nu}'
visualizacion:
  componente: DistributionStudio
  parametros:
    explorador:
      distribucion: t
      valores:
        nu: 7
      casos:
        - nombre: 'Un grado'
          descripcion: 'Con ν = 1 la t es una Cauchy: colas tan pesadas que la media no existe.'
          valores: {nu: 1}
        - nombre: 'Ocho mediciones'
          descripcion: 'Con 8 datos hay 7 grados: colas más pesadas que la normal, valor crítico 2.365 en lugar de 1.96.'
          valores: {nu: 7}
        - nombre: 'Treinta grados'
          descripcion: 'Con ν = 30 el denominador casi no varía y la t es casi la normal.'
          valores: {nu: 30}
      ejemplo:
        titulo: 'Resultado extremo'
        contexto: 'Con 8 mediciones de un contaminante, el estadístico t sigue una t con 7 grados de libertad.'
        pregunta: '¿Qué probabilidad hay de obtener por azar un valor al menos tan extremo como 2 en cualquier dirección?'
        valores: {nu: 7}
        region: colas
        desde: -2
        hasta: 2
      referencia:
        distribucion: normal
        valores: {mu: 0, sigma: 1}
        etiqueta: 'Normal estándar'
        visible: true
    genesis:
      componente: ContinuousGenesis
      parametros:
        proceso: cociente-t
        valores:
          nu: 4
          mu: 0
        fijos: [mu]
referencias:
  - clave: casella-berger
    capitulo: '5'
  - clave: degroot
    capitulo: '8'
publicado: true
---

## Intuición

Un laboratorio mide la concentración de un contaminante en solo 8 muestras de agua y quiere saber qué tan lejos puede estar el promedio de la concentración real. Si conociera la desviación estándar verdadera, dividiría el error del promedio entre ella y obtendría una normal estándar. Pero no la conoce: tiene que estimarla con las mismas 8 muestras, y esa estimación también es aleatoria. A veces sale pequeña por azar, y entonces el cociente sale grande.

La distribución t de Student describe precisamente ese cociente: una normal estándar dividida entre una estimación ruidosa de la escala. El ruido del denominador produce colas más pesadas que las de la normal, es decir, valores extremos más frecuentes. Cuantos más datos se usan para estimar la escala, menos ruidoso es el denominador y más se parece la t a la normal.

William Sealy Gosset la publicó en 1908 con el seudónimo de Student mientras trabajaba en una cervecería, donde los experimentos se hacían con muestras pequeñas. Hoy aparece en todos los intervalos de confianza y pruebas sobre medias cuando la varianza es desconocida, y también como modelo robusto para datos con valores atípicos.

## Definición

:::definicion[Distribución t de Student]
Sean $Z \sim \mathcal{N}(0, 1)$ y $V \sim \chi^{2}_{\nu}$ independientes. La variable $T = Z/\sqrt{V/\nu}$ tiene **distribución t de Student con $\nu$ grados de libertad**, $T \sim t_{\nu}$, con densidad
$$
f(t) = \frac{\Gamma\!\left(\frac{\nu + 1}{2}\right)}{\sqrt{\nu\pi}\,\Gamma\!\left(\frac{\nu}{2}\right)}\left(1 + \frac{t^{2}}{\nu}\right)^{-\frac{\nu + 1}{2}}, \qquad t \in \mathbb{R}.
$$
:::

:::teorema[Media estandarizada con varianza estimada]
Si $X_1, \dots, X_n$ son $\mathcal{N}(\mu, \sigma^{2})$ independientes, con media muestral $\bar{X}$ y desviación muestral $S$, entonces
$$
\frac{\bar{X} - \mu}{S/\sqrt{n}} \sim t_{n - 1}.
$$
:::

:::nota[Qué significa cada símbolo]
- $T$: cociente con distribución t.
- $Z$: normal estándar del numerador.
- $V$: chi-cuadrada del denominador, independiente de $Z$.
- $\nu$: grados de libertad.
- $\Gamma$: función gamma.
- $\bar{X}$, $S$: media y desviación muestrales.
- $n$: tamaño de la muestra; $\mu$: media de la población.
:::

## Cómo usar la visualización

La pestaña Distribución muestra la densidad $t_{\nu}$ junto a la normal estándar (línea punteada), la región elegida y su probabilidad; los casos cargan 1, 7 y 30 grados y el ejemplo de la ficha se carga con su botón. La pestaña Ver cómo surge divide una normal entre la raíz de una chi-cuadrada sobre sus grados, y muestra cómo los denominadores pequeños producen valores extremos.

Con un grado las colas están muy por encima de la normal; con 30 las curvas casi coinciden. En el ejemplo, las dos colas más allá de $\pm 2$ suman 0.086, casi el doble que con la normal.

## Ejemplo

Con 8 mediciones normales, el estadístico $T = (\bar{X} - \mu)/(S/\sqrt{8})$ sigue $t_{7}$.

1. El cuantil 0.975 de $t_{7}$ es 2.365, frente a 1.960 de la normal.
2. Un intervalo de confianza del 95 % para $\mu$ es $\bar{X} \pm 2.365\,S/\sqrt{8}$, un 21 % más ancho que si se usara 1.96.
3. Si se observa $T = 2$, la probabilidad de un valor al menos tan extremo es $P(|T| \ge 2) \approx 0.086$ con $t_7$, mientras que con la normal sería 0.046.
4. Ignorar que la escala se estimó lleva a declarar diferencias significativas con demasiada facilidad.

:::figura[t con 7 grados de libertad: las dos colas más allá de ±2 suman 0.086; con la normal estándar (línea punteada) serían 0.046.]{componente="DistributionExplorer"}
```yaml
distribucion: t
valores:
  nu: 7
ejemplo:
  titulo: 'Resultado extremo'
  contexto: 'Con 8 mediciones de un contaminante, el estadístico t sigue una t con 7 grados de libertad.'
  pregunta: '¿Qué probabilidad hay de obtener por azar un valor al menos tan extremo como 2 en cualquier dirección?'
  valores: {nu: 7}
  region: colas
  desde: -2
  hasta: 2
region: colas
desde: -2
hasta: 2
muestras: false
referencia:
  distribucion: normal
  valores: {mu: 0, sigma: 1}
  etiqueta: 'Normal estándar'
  visible: true
```
:::

## Propiedades

- **Simetría:** la densidad es simétrica alrededor de cero.
- **Media:** 0 si $\nu > 1$; con $\nu = 1$ la media no existe.
- **Varianza:** $\nu/(\nu - 2)$ si $\nu > 2$, mayor que 1; infinita si $1 < \nu \le 2$.
- **Colas polinomiales:** la densidad decae como $|t|^{-(\nu + 1)}$, mucho más lento que la normal.
- **Caso $\nu = 1$:** la $t_1$ es la distribución de Cauchy estándar.
- **Límite:** $t_{\nu} \to \mathcal{N}(0, 1)$ cuando $\nu \to \infty$.
- **Mezcla de normales:** $t_{\nu}$ es una normal cuya varianza se elige al azar con una gamma inversa, lo que la vuelve un modelo robusto para datos con atípicos.

:::figura[Tres casos con contexto (un grado, ocho mediciones, treinta grados): cada botón carga los parámetros y una frase explica por qué la forma es así.]{componente="DistributionExplorer"}
```yaml
distribucion: t
valores:
  nu: 7
casos:
  - nombre: 'Un grado'
    descripcion: 'Con ν = 1 la t es una Cauchy: colas tan pesadas que la media no existe.'
    valores: {nu: 1}
  - nombre: 'Ocho mediciones'
    descripcion: 'Con 8 datos hay 7 grados: colas más pesadas que la normal, valor crítico 2.365 en lugar de 1.96.'
    valores: {nu: 7}
  - nombre: 'Treinta grados'
    descripcion: 'Con ν = 30 el denominador casi no varía y la t es casi la normal.'
    valores: {nu: 30}
referencia:
  distribucion: normal
  valores: {mu: 0, sigma: 1}
  etiqueta: 'Normal estándar'
  visible: true
```
:::

:::figura[Un grado de libertad: el cociente produce valores extremos con mucha frecuencia; la t₁ es la distribución de Cauchy.]{componente="ContinuousGenesis"}
```yaml
proceso: cociente-t
valores:
  nu: 1
  mu: 0
fijos: [mu]
```
:::

:::figura[Con 30 grados de libertad la t (curva) casi coincide con la normal estándar (línea punteada).]{componente="DistributionExplorer"}
```yaml
distribucion: t
valores:
  nu: 30
muestras: false
referencia:
  distribucion: normal
  valores:
    mu: 0
    sigma: 1
  etiqueta: Normal estándar
```
:::

## Errores comunes

- **Usar 1.96 con muestras pequeñas y varianza estimada.** Con $n = 8$ el valor correcto es 2.365; usar 1.96 da intervalos demasiado estrechos.
- **Usar n grados de libertad en lugar de n - 1.** Estimar la media consume un grado.
- **Suponer que la varianza es 1.** La varianza de $t_{\nu}$ es $\nu/(\nu - 2)$; con $\nu = 4$ vale 2.
- **Aplicarla con datos muy no normales y muestras pequeñas.** La t exacta requiere normalidad; con colas muy pesadas o fuerte asimetría el resultado puede ser engañoso.

:::figura[Varianza mayor que 1: la t con 4 grados de libertad (curva) tiene varianza 2; la normal con esa misma varianza (línea punteada) es más alta en los hombros y más baja en el centro y en las colas.]{componente="DistributionExplorer"}
```yaml
distribucion: t
valores:
  nu: 4
muestras: false
referencia:
  distribucion: normal
  valores:
    mu: 0
    sigma: 1.414
  etiqueta: Normal de varianza 2
```
:::

## Conexiones

La t de Student se obtiene de la [[normal-estandar-y-puntuacion-z|normal estándar]] y de la [[distribucion-chi-cuadrada]]; su cuadrado es una [[distribucion-f-de-snedecor]] con 1 y $\nu$ grados de libertad. Con un grado de libertad es la [[distribucion-de-cauchy]], y con infinitos, la [[distribucion-normal]]. Si el numerador tiene media distinta de cero se obtiene la [[distribucion-t-no-central]], que describe la potencia de las pruebas t.

## Formulario

:::formula[Construcción]
$$
T = \frac{Z}{\sqrt{V/\nu}}, \qquad Z \sim \mathcal{N}(0, 1),\ V \sim \chi^{2}_{\nu}
$$

- $\nu$: grados de libertad del denominador.
:::

:::formula[Densidad]
$$
f(t) = \frac{\Gamma\!\left(\frac{\nu + 1}{2}\right)}{\sqrt{\nu\pi}\,\Gamma\!\left(\frac{\nu}{2}\right)}\left(1 + \frac{t^{2}}{\nu}\right)^{-\frac{\nu + 1}{2}}
$$

- $\Gamma$: función gamma.
:::

:::formula[Estadístico t de una muestra]
$$
\frac{\bar{X} - \mu}{S/\sqrt{n}} \sim t_{n - 1}
$$

- $\bar{X}$: media muestral.
- $S$: desviación muestral.
- $n$: tamaño de la muestra.
:::

:::formula[Media y varianza]
$$
\mathbb{E}[T] = 0\ (\nu > 1), \qquad \operatorname{Var}(T) = \frac{\nu}{\nu - 2}\ (\nu > 2)
$$

- Con pocos grados la media o la varianza no existen.
:::
