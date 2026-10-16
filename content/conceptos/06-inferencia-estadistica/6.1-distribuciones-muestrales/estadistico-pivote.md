---
id: estadistico-pivote
titulo: Estadístico pivote
titulo_en: Pivotal quantity
alias:
  - cantidad pivotal
  - pivote
modulo: 6
submodulo: '6.1'
orden: 7
nivel: intermedio
prerrequisitos:
  - teorema-de-cochran
  - distribucion-t-de-student
etiquetas:
  - inferencia
  - pivotes
  - distribución t
  - intervalos de confianza
resumen: >
  Un pivote es una función de la muestra y del parámetro cuya distribución no depende de ningún parámetro
  desconocido. Despejar el parámetro de un intervalo de probabilidad del pivote produce intervalos de confianza.
formula: 'T = \frac{\bar{X} - \mu}{S/\sqrt{n}} \sim t_{n-1}\quad \text{para toda } (\mu, \sigma^2)'
visualizacion:
  componente: SamplingLab
  parametros:
    modo: pivote
    poblacion: normal
    n: 5
    media: 20
    desviacion: 4
referencias:
  - clave: casella-berger
    capitulo: '9'
  - clave: wasserman
    capitulo: '6'
publicado: true
---

## Intuición

Para saber qué tan lejos puede estar una media muestral de la media verdadera $\mu$ hace falta conocer su distribución, pero esa distribución depende de $\mu$ y de $\sigma$, justamente lo que no se conoce. El truco es combinar la muestra y el parámetro en una cantidad cuya distribución no dependa de nada desconocido. Si a la diferencia $\bar{X} - \mu$ se la divide entre su error estándar estimado $S/\sqrt{n}$, el resultado tiene siempre la misma distribución, la t de Student con $n - 1$ grados de libertad, sea cual sea la media y sea cual sea la desviación de la población normal.

Esa cantidad es un **pivote**: algo así como una regla que se puede llevar a cualquier población normal y que siempre mide igual. Como su distribución es conocida, se puede afirmar que con probabilidad 0.95 cae entre dos valores fijos; al despejar $\mu$ de esas desigualdades se obtiene un intervalo de confianza. Casi todos los intervalos y pruebas clásicos se construyen así.

## Definición

:::definicion[Estadístico pivote]
Una **cantidad pivotal** o pivote para un parámetro $\theta$ es una función $Q(X_1, \dots, X_n, \theta)$ de la muestra y del parámetro cuya distribución es la misma para todos los valores de los parámetros del modelo.
:::

Ejemplos con una muestra $X_1, \dots, X_n$ de $\mathcal{N}(\mu, \sigma^2)$:

- Con $\sigma$ conocida: $Z = \dfrac{\bar{X} - \mu}{\sigma/\sqrt{n}} \sim \mathcal{N}(0, 1)$.
- Con $\sigma$ desconocida: $T = \dfrac{\bar{X} - \mu}{S/\sqrt{n}} \sim t_{n-1}$.
- Para la varianza: $\dfrac{(n - 1)S^2}{\sigma^2} \sim \chi^2_{n-1}$.

**Método del pivote:** si $P(a \le Q \le b) = 1 - \alpha$ con $a$ y $b$ conocidos, el conjunto de valores de $\theta$ que cumplen $a \le Q(X_1, \dots, X_n, \theta) \le b$ es un intervalo de confianza de nivel $1 - \alpha$. Para $T$:
$$
\bar{X} \pm t_{n-1,\,1-\alpha/2}\,\frac{S}{\sqrt{n}}.
$$

:::nota[Qué significa cada símbolo]
- $Q$: cantidad pivotal; $\theta$: parámetro de interés.
- $X_1, \dots, X_n$: muestra; $n$: tamaño; $\bar{X}$: media muestral; $S$: desviación estándar muestral; $S^2$: varianza muestral.
- $\mu$, $\sigma$: media y desviación de la población normal.
- $Z$, $T$: pivotes normal estándar y t de Student; $t_{n-1}$: t con $n - 1$ grados de libertad.
- $t_{n-1,\,1-\alpha/2}$: cuantil $1 - \alpha/2$ de la t; $\alpha$: probabilidad de error del intervalo.
- $a$, $b$: cuantiles que encierran probabilidad $1 - \alpha$.
:::

## Cómo usar la visualización

Para cada muestra de tamaño $n$ se calcula $T = (\bar{x} - \mu)/(s/\sqrt{n})$ con la media verdadera de la población. El histograma de $T$ se compara con la t de Student de $n - 1$ grados de libertad y, en línea punteada, con la normal estándar; las líneas verticales marcan los cuantiles que dejan 2.5 % en cada cola.

Controles: forma de la población, tamaño de muestra, **Media de la población** y **Desviación de la población**.

Experimentos sugeridos:

1. Cambiar la media a 80 y la desviación a 30: el histograma de $T$ no cambia. Esa es la propiedad pivotal.
2. Con $n = 5$, comparar las colas con la normal: la t es más pesada, y cerca de 5 % de los valores cae fuera de $\pm 2.78$.
3. Cambiar la población a lognormal con $n = 5$ (en ese caso la media se fija en el doble de la desviación, para conservar la forma): el histograma se vuelve asimétrico y la proporción fuera deja de ser 5 %; $T$ solo es pivote exacto con poblaciones normales.

## Ejemplo

Diez mediciones del tiempo de respuesta de un servicio dan $\bar{x} = 52.3$ ms y $s = 4$ ms; se supone normalidad.

1. Error estándar estimado: $s/\sqrt{n} = 4/\sqrt{10} \approx 1.265$.
2. Para $\mu = 50$: $T = (52.3 - 50)/1.265 \approx 1.818$, un valor común para una $t_9$.
3. Cuantil: $t_{9,\,0.975} \approx 2.262$, de modo que $P(-2.262 \le T \le 2.262) = 0.95$.
4. Despejando $\mu$: $52.3 \pm 2.262 \cdot 1.265 = 52.3 \pm 2.86$, es decir, el intervalo $[49.44,\ 55.16]$ ms.

:::figura[Pivote con muestras de 10 de una normal: el histograma de T coincide con la t de 9 grados de libertad, cuyos cuantiles de 2.5 % están en más o menos 2.262.]{componente="SamplingLab"}
```yaml
modo: pivote
poblacion: normal
n: 10
media: 50
desviacion: 4
```
:::

## Propiedades

- **No es un estadístico:** depende del parámetro desconocido, pero su distribución no.
- **Invariancia:** la distribución de $T$ es la misma para cualquier $\mu$ y $\sigma$ porque $\bar{X} - \mu$ y $S$ escalan igual con $\sigma$.
- **Con muestras grandes,** $t_{n-1}$ se acerca a $\mathcal{N}(0, 1)$, y $T$ es un pivote aproximado aun sin normalidad, por el teorema central del límite y el teorema de Slutsky.
- **Base de intervalos y pruebas:** el intervalo t y la prueba t son el mismo pivote leído de dos maneras.

:::figura[Muestras grandes: con n igual a 60, la t casi coincide con la normal estándar.]{componente="SamplingLab"}
```yaml
modo: pivote
poblacion: uniforme
n: 60
media: 0
desviacion: 1
```
:::

## Errores comunes

- **Llamar pivote a cualquier estadístico estandarizado.** Si su distribución depende de un parámetro desconocido, no sirve para construir intervalos exactos.
- **Usar la normal en lugar de la t con muestras pequeñas.** Con $n = 5$, el cuantil normal 1.96 es mucho menor que $t_{4,\,0.975} = 2.776$, y los intervalos salen demasiado angostos.
- **Suponer que $T$ es pivote exacto con cualquier población.** Con poblaciones asimétricas y muestras pequeñas su distribución depende de la forma.

:::figura[Población muy asimétrica con muestras pequeñas: el histograma de T es asimétrico y no sigue la t.]{componente="SamplingLab"}
```yaml
modo: pivote
poblacion: lognormal
n: 5
media: 10
desviacion: 8
```
:::

## Conexiones

El pivote $T$ combina la [[distribucion-de-la-media-muestral]] con la [[distribucion-de-la-varianza-muestral]], y su independencia, dada por el [[teorema-de-cochran]], produce la [[distribucion-t-de-student]]. Su escala es el [[error-estandar]]. Los pivotes aproximados se justifican con el [[teorema-central-del-limite]] y el [[teorema-de-slutsky]].

## Formulario

:::formula[Pivote normal con sigma conocida]
$$
Z = \frac{\bar{X} - \mu}{\sigma/\sqrt{n}} \sim \mathcal{N}(0, 1)
$$

- $\bar{X}$: media muestral; $\mu$, $\sigma$: media y desviación de la población; $n$: tamaño.
:::

:::formula[Pivote t]
$$
T = \frac{\bar{X} - \mu}{S/\sqrt{n}} \sim t_{n-1}
$$

- $S$: desviación estándar muestral; $t_{n-1}$: t de Student con $n - 1$ grados de libertad.
:::

:::formula[Pivote para la varianza]
$$
\frac{(n - 1)S^2}{\sigma^2} \sim \chi^2_{n-1}
$$

- $S^2$: varianza muestral; $\chi^2_{n-1}$: chi cuadrada con $n - 1$ grados de libertad.
:::

:::formula[Intervalo por el método del pivote]
$$
\bar{X} \pm t_{n-1,\,1-\alpha/2}\,\frac{S}{\sqrt{n}}
$$

- $t_{n-1,\,1-\alpha/2}$: cuantil de la t; $1 - \alpha$: nivel de confianza.
:::
