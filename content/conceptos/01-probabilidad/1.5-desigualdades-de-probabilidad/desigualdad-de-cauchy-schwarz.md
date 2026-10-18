---
id: desigualdad-de-cauchy-schwarz
titulo: Desigualdad de Cauchy y Schwarz
titulo_en: Cauchy-Schwarz inequality
alias:
  - desigualdad de Cauchy-Bunyakovsky-Schwarz
  - cota del producto
modulo: 1
submodulo: '1.5'
orden: 5
nivel: intermedio
prerrequisitos:
  - covarianza
  - producto-punto
relaciones:
  - tipo: relacionado
    id: correlacion-de-pearson
  - tipo: caso-particular
    id: desigualdad-de-holder
etiquetas:
  - producto de variables
  - segundos momentos
  - correlación acotada
  - igualdad en el caso lineal
resumen: >
  La esperanza del producto de dos variables está acotada por la raíz del producto de sus segundos
  momentos. Aplicada a las desviaciones respecto a la media, prueba que la correlación está entre
  -1 y 1.
formula: '\big|\mathbb{E}[XY]\big| \le \sqrt{\mathbb{E}[X^2]\,\mathbb{E}[Y^2]}'
visualizacion:
  componente: InequalityBound
  parametros:
    modo: holder
    rho: 0.5
referencias:
  - clave: blitzstein-hwang
    capitulo: '10.1'
  - clave: casella-berger
    capitulo: '4.7'
publicado: true
---

## Intuición

En geometría, el producto punto de dos vectores es a lo más el producto de sus longitudes, con igualdad cuando apuntan en la misma dirección. Las variables aleatorias se comportan como vectores: $\mathbb{E}[XY]$ hace el papel del producto punto y $\sqrt{\mathbb{E}[X^2]}$ el de la longitud. La **desigualdad de Cauchy y Schwarz** es la misma afirmación: la esperanza del producto no puede exceder el producto de las "longitudes" de las variables.

Su aplicación más importante es estadística. Si se aplica a $X - \mu_X$ y $Y - \mu_Y$, dice que la covarianza está acotada por el producto de las desviaciones estándar. Dividiendo, la correlación queda entre $-1$ y 1, y vale $\pm 1$ solo cuando una variable es función lineal de la otra, el caso en que los "vectores" son paralelos.

## Definición

:::teorema[Desigualdad de Cauchy y Schwarz]
Si $\mathbb{E}[X^2]$ y $\mathbb{E}[Y^2]$ son finitos, entonces
$$
\big|\mathbb{E}[XY]\big| \le \mathbb{E}|XY| \le \sqrt{\mathbb{E}[X^2]\,\mathbb{E}[Y^2]}.
$$
Entre $|\mathbb{E}[XY]|$ y la raíz hay igualdad si y solo si $Y = cX$ o $X = cY$ con probabilidad 1 para alguna constante $c$. En la cota $\mathbb{E}|XY| \le \sqrt{\mathbb{E}[X^2]\,\mathbb{E}[Y^2]}$ basta con que $|Y| = c|X|$ o $|X| = c|Y|$: por ejemplo, $Y = |X|$ da igualdad ahí sin ser múltiplo de $X$.
:::

La prueba supone $\mathbb{E}[Y^2] > 0$; si $\mathbb{E}[Y^2] = 0$, entonces $Y = 0$ con probabilidad 1 y los dos lados valen 0. La función $s \mapsto \mathbb{E}[(X - sY)^2] = \mathbb{E}[X^2] - 2s\,\mathbb{E}[XY] + s^2\,\mathbb{E}[Y^2]$ es un polinomio de grado 2 que nunca es negativo, así que no cambia de signo y su discriminante es menor o igual que 0: $4(\mathbb{E}[XY])^2 - 4\,\mathbb{E}[X^2]\,\mathbb{E}[Y^2] \le 0$. Tiene una raíz doble solo en el caso de igualdad, cuando $X = sY$ con probabilidad 1.

:::figura[Con correlación 0.9, $|\mathbb{E}[XY]| = 0.9$ y $\mathbb{E}|XY| \approx 0.92$ están cerca de la cota 1, porque la relación es casi lineal.]{componente="InequalityBound"}
```yaml
modo: holder
rho: 0.9
```
:::

:::nota[Qué significa cada símbolo]
- $X$, $Y$: variables con segundo momento finito.
- $\mathbb{E}[XY]$: esperanza del producto; $\mathbb{E}|XY|$: esperanza de su valor absoluto.
- $\mathbb{E}[X^2]$, $\mathbb{E}[Y^2]$: segundos momentos.
- $s$, $c$: constantes reales.
- $\mathbf{1}_A$: indicadora del evento $A$, que vale 1 si ocurre y 0 si no; $P(A)$: su probabilidad.
- $\operatorname{Cov}(X, Y)$: covarianza; $a$, $b$: coeficientes de una relación lineal.
- $\mu_X$, $\mu_Y$: medias; $\sigma_X$, $\sigma_Y$: desviaciones estándar; $\rho$: correlación.
:::

## Cómo usar la visualización

$X$ y $Y$ son normales estándar con correlación $\rho$, así que $\mathbb{E}[X^2] = \mathbb{E}[Y^2] = 1$ y la cota de Cauchy y Schwarz es 1. La gráfica muestra $|\mathbb{E}[XY]| = |\rho|$ y $\mathbb{E}|XY|$ como funciones de $\rho$, siempre debajo de la línea de la cota. El encabezado escribe la cadena de desigualdades con los valores actuales.

La deslizadera cambia $\rho$ y el botón de reproducción la recorre de $-0.99$ a 0.99. En los extremos del control, $\pm 0.99$, las dos curvas se acercan mucho a la cota sin tocarla; solo la tocarían con $\rho = \pm 1$, cuando $Y = X$ o $Y = -X$.

## Ejemplo

Dos variables tienen varianzas 4 y 9, y se reporta una covarianza de 7.

1. Cauchy y Schwarz aplicada a las desviaciones: $|\operatorname{Cov}(X, Y)| \le \sigma_X \sigma_Y = 2 \cdot 3 = 6$.
2. Una covarianza de 7 es imposible: el reporte contiene un error.
3. La correlación implícita sería $7/6 \approx 1.17 > 1$, otra manera de ver lo mismo.

:::figura[El ejemplo en variables estandarizadas, $(X - \mu_X)/2$ y $(Y - \mu_Y)/3$: la esperanza de su producto es $\operatorname{Cov}(X, Y)/6$, la correlación, y nunca rebasa la cota 1. La covarianza reportada exigiría $7/6 \approx 1.17$; incluso con correlación 0.99 la covarianza sería $0.99 \cdot 6 = 5.94$.]{componente="InequalityBound"}
```yaml
modo: holder
rho: 0.99
```
:::

## Propiedades

- **Correlación:** $|\operatorname{Cov}(X, Y)| \le \sigma_X \sigma_Y$, de donde $-1 \le \rho \le 1$.
- **Igualdad:** solo con dependencia lineal exacta; en particular $|\rho| = 1$ si y solo si $Y = aX + b$.
- **Momentos:** con $Y = 1$ da $(\mathbb{E}|X|)^2 \le \mathbb{E}[X^2]$, otra forma de la desigualdad de Jensen.
- **Generalización:** es el caso $p = q = 2$ de la desigualdad de Hölder.
- **Probabilidades:** con $Y = \mathbf{1}_A$ se obtiene $\big(\mathbb{E}[X\mathbf{1}_A]\big)^2 \le \mathbb{E}[X^2]\,P(A)$, útil para acotar la contribución de un evento a una media.

:::figura[Casi en el caso de igualdad con dependencia negativa: con correlación $-0.99$, $\mathbb{E}[XY] = -0.99$ y las dos curvas están pegadas a la cota en el extremo izquierdo, sin tocarla.]{componente="InequalityBound"}
```yaml
modo: holder
rho: -0.99
```
:::

## Errores comunes

- **Confundir $|\mathbb{E}[XY]|$ con $\mathbb{E}|XY|$.** Con correlación 0, $\mathbb{E}[XY] = 0$ pero $\mathbb{E}|XY| = 2/\pi \approx 0.64$; la desigualdad acota a ambas.
- **Usar varianzas en lugar de segundos momentos.** La forma básica usa $\mathbb{E}[X^2]$; para la covarianza hay que aplicarla a las variables centradas.
- **Creer que una correlación cercana a 1 implica igualdad.** Solo $|\rho| = 1$ exacto corresponde a una relación lineal exacta.

:::figura[Correlación 0: $\mathbb{E}[XY] = 0$ y, sin embargo, $\mathbb{E}|XY| \approx 0.64$. Las dos cantidades miden cosas distintas.]{componente="InequalityBound"}
```yaml
modo: holder
rho: 0
```
:::

## Conexiones

La desigualdad de Cauchy y Schwarz traslada al mundo de las variables aleatorias la cota del [[producto-punto]], y su consecuencia más usada es que la [[correlacion-de-pearson]] está entre $-1$ y 1, lo que hace de la [[covarianza]] una medida acotada. Es el caso $p = 2$ de la [[desigualdad-de-holder]] y está emparentada con la [[desigualdad-de-jensen]].

## Formulario

:::formula[Desigualdad de Cauchy y Schwarz]
$$
\big|\mathbb{E}[XY]\big| \le \mathbb{E}|XY| \le \sqrt{\mathbb{E}[X^2]\,\mathbb{E}[Y^2]}
$$

- $X$, $Y$: variables aleatorias con segundos momentos $\mathbb{E}[X^2]$ y $\mathbb{E}[Y^2]$ finitos; $\mathbb{E}$: esperanza.
- $\mathbb{E}[XY]$: esperanza del producto; $\mathbb{E}|XY|$: esperanza de su valor absoluto.
- Igualdad entre el primer término y la raíz si y solo si $Y = cX$ o $X = cY$ con probabilidad 1; en la segunda desigualdad basta $|Y| = c|X|$ o $|X| = c|Y|$, con $c$ constante.
:::

:::formula[Covarianza acotada]
$$
|\operatorname{Cov}(X, Y)| \le \sigma_X \sigma_Y, \qquad -1 \le \rho \le 1
$$

- $\operatorname{Cov}(X, Y)$: covarianza; $\sigma_X$, $\sigma_Y$: desviaciones estándar.
- $\rho = \operatorname{Cov}(X, Y)/(\sigma_X \sigma_Y)$: correlación.
- Se obtiene aplicando la desigualdad a $X - \mu_X$ y $Y - \mu_Y$, con $\mu_X$, $\mu_Y$ las medias.
:::

:::formula[Contribución de un evento]
$$
\big(\mathbb{E}[X\mathbf{1}_A]\big)^2 \le \mathbb{E}[X^2]\,P(A)
$$

- $\mathbf{1}_A$: indicadora del evento $A$; $P(A)$: su probabilidad.
- Es el caso $Y = \mathbf{1}_A$, porque $\mathbb{E}[\mathbf{1}_A^2] = P(A)$.
:::

:::formula[Normales estándar correlacionadas]
$$
\mathbb{E}|XY| = \frac{2}{\pi}\Big(\sqrt{1 - \rho^2} + \rho \arcsin \rho\Big)
$$

- $X$, $Y$: normales estándar con correlación $\rho$, de modo que $\mathbb{E}[XY] = \rho$.
- $\arcsin$: función inversa del seno; con $\rho = 0$ vale $2/\pi \approx 0.64$.
:::
