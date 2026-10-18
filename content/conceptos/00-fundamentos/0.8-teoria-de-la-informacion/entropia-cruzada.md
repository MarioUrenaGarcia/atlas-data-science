---
id: entropia-cruzada
titulo: Entropía cruzada
titulo_en: Cross-entropy
alias:
  - pérdida de entropía cruzada
  - log loss
  - pérdida logarítmica
  - H(p, q)
modulo: 0
submodulo: '0.8'
orden: 6
nivel: intermedio
prerrequisitos:
  - entropia-de-shannon
etiquetas:
  - entropía cruzada
  - función de pérdida
  - clasificación
  - teoría de la información
resumen: >
  La entropía cruzada H(p, q) es la sorpresa promedio que un modelo q asigna a datos generados por p.
  Es al menos H(p), lo excede justo en la divergencia KL y es la pérdida usual en clasificación.
formula: 'H(p, q) = -\sum_{x} p(x) \log_2 q(x) = H(p) + D_{\mathrm{KL}}(p \,\|\, q)'
visualizacion:
  componente: InformationViz
  parametros:
    modo: divergencia
    p: [0.6, 0.25, 0.15]
    q: [1, 1, 1]
    enfoque: cruzada
    etiquetas: [norte, centro, sur]
referencias:
  - clave: cover-thomas
    capitulo: '5'
  - clave: goodfellow
    capitulo: '5'
publicado: true
---

## Intuición

Una empresa de envíos diseña su sistema suponiendo que los pedidos llegan por igual de tres regiones, cuando en realidad 60 % vienen del norte. Cada pedido real sorprende al sistema según la probabilidad que el modelo le asignaba, no según la verdadera. La entropía cruzada es esa sorpresa promedio: los datos los genera una distribución $p$, pero se miden con las probabilidades de un modelo $q$.

Si el modelo coincide con la realidad, la sorpresa promedio es la entropía de $p$, el mínimo posible. Cualquier discrepancia la aumenta, y el aumento es exactamente la divergencia de Kullback-Leibler. En codificación, la entropía cruzada es el número promedio de bits por símbolo que gasta un código diseñado para $q$ cuando se usa con datos de $p$.

En aprendizaje automático, minimizar la entropía cruzada entre las etiquetas observadas y las probabilidades predichas es lo mismo que maximizar la verosimilitud del modelo.

## Definición

:::definicion[Entropía cruzada]
Sean $p$ y $q$ funciones de masa sobre el mismo conjunto $\mathcal{X}$. La entropía cruzada de $q$ respecto de $p$ es
$$
H(p, q) = -\sum_{x \in \mathcal{X}} p(x) \log_2 q(x) = \mathbb{E}_{X \sim p}\left[-\log_2 q(X)\right].
$$
Es finita si $q(x) > 0$ en todo $x$ con $p(x) > 0$, y se descompone como
$$
H(p, q) = H(p) + D_{\mathrm{KL}}(p \,\|\, q).
$$
:::

Para una muestra $x_1, \dots, x_n$ y un modelo $q$, la entropía cruzada empírica es $-\frac{1}{n}\sum_{i=1}^{n} \log q(x_i)$, la log-verosimilitud negativa promedio.

:::nota[Qué significa cada símbolo]
- $p$: distribución que genera los datos.
- $q$: distribución del modelo.
- $\mathcal{X}$: conjunto de valores posibles.
- $H(p, q)$: entropía cruzada en bits.
- $\mathbb{E}_{X \sim p}$: esperanza cuando $X$ tiene distribución $p$.
- $H(p)$: entropía de $p$.
- $D_{\mathrm{KL}}(p \,\|\, q)$: divergencia de Kullback-Leibler de $q$ respecto de $p$.
- $x_1, \dots, x_n$: observaciones; $n$: tamaño de la muestra.
:::

## Cómo usar la visualización

En cada región hay dos barras: la primera es $p$, la distribución real de los pedidos, y la segunda es $q$, el modelo; la leyenda indica sus colores. El encabezado escribe $H(p, q)$ y su descomposición en $H(p)$ más la divergencia KL. La reproducción mueve $q$ en línea recta hacia $p$.

Al inicio, con el modelo uniforme, $H(p, q) = 1.585$ bits, que son $1.353$ de entropía real más $0.232$ de divergencia. Al avanzar, la parte de divergencia se encoge y $H(p, q)$ baja hasta $H(p) = 1.353$, que no cambia en toda la animación. Las lecturas muestran también la divergencia en el otro sentido, $D_{\mathrm{KL}}(q \,\|\, p)$, y la de Jensen-Shannon.

## Ejemplo

Un clasificador de imágenes con tres clases (perro, gato, ave) recibe la foto de un perro y predice probabilidades $q = (0.7, 0.2, 0.1)$. La etiqueta verdadera es la distribución $p = (1, 0, 0)$.

1. Solo el término de la clase verdadera sobrevive: $H(p, q) = -1 \cdot \log_2 0.7 = 0.515$ bits.
2. En nats, la unidad de las bibliotecas de aprendizaje, $-\log 0.7 = 0.357$.
3. Como $H(p) = 0$, toda la pérdida es divergencia: $D_{\mathrm{KL}}(p \,\|\, q) = 0.515$ bits.
4. Si el modelo predijera 0.95 para perro, la pérdida bajaría a $-\log_2 0.95 = 0.074$ bits.

:::figura[Etiqueta de perro contra la predicción (0.7, 0.2, 0.1): la entropía cruzada parte de 0.515 bits, toda ella divergencia porque H(p) es cero, y baja a cero al llevar la predicción a la etiqueta.]{componente="InformationViz"}
```yaml
modo: divergencia
p: [1, 0, 0]
q: [0.7, 0.2, 0.1]
enfoque: cruzada
etiquetas: [perro, gato, ave]
```
:::

## Propiedades

- **Desigualdad de Gibbs:** $H(p, q) \ge H(p)$, con igualdad si y solo si $q = p$.
- **Descomposición:** $H(p, q) = H(p) + D_{\mathrm{KL}}(p \,\|\, q)$; como $H(p)$ no depende del modelo, minimizar la entropía cruzada en $q$ equivale a minimizar la divergencia.
- **Asimetría:** en general $H(p, q) \ne H(q, p)$.

:::figura[Las mismas dos distribuciones con los papeles invertidos: si los datos son uniformes y el modelo es (0.6, 0.25, 0.15), la entropía cruzada vale 1.825 bits en lugar de 1.585.]{componente="InformationViz"}
```yaml
modo: divergencia
p: [1, 1, 1]
q: [0.6, 0.25, 0.15]
enfoque: cruzada
etiquetas: [norte, centro, sur]
```
:::

- **Relación con la verosimilitud:** para datos $x_1, \dots, x_n$, $-\sum_i \log q(x_i) = n\,H(\hat{p}, q)$ con logaritmo natural, donde $\hat{p}$ es la distribución empírica de los datos; minimizar la entropía cruzada empírica es maximizar la verosimilitud.
- **Convexidad:** $H(p, q)$ es convexa en $q$ para $p$ fija.

## Errores comunes

- **Asignar probabilidad cero a algo que puede ocurrir.** Si el modelo da $q(x) = 0$ a un valor con $p(x) > 0$, la entropía cruzada es infinita. Por eso los clasificadores nunca predicen exactamente 0 y se suavizan las frecuencias estimadas.

:::figura[Datos (0.5, 0.4, 0.1) y un modelo que da probabilidad cero al tercer valor: la entropía cruzada es infinita al inicio y se vuelve finita en cuanto el modelo le asigna algo de probabilidad.]{componente="InformationViz"}
```yaml
modo: divergencia
p: [0.5, 0.4, 0.1]
q: [0.6, 0.4, 0]
enfoque: cruzada
etiquetas: [x1, x2, x3]
```
:::

- **Pensar que una entropía cruzada baja indica un buen modelo en términos absolutos.** Su mínimo es $H(p)$, que puede ser grande; lo que se compara entre modelos es la parte de divergencia, o la entropía cruzada sobre los mismos datos.
- **Invertir los argumentos.** En la pérdida de clasificación la esperanza se toma con las etiquetas y el logaritmo se aplica a las predicciones: $-\sum p \log q$, no $-\sum q \log p$, que sería infinita con etiquetas de un solo valor.
- **Mezclar bits y nats al comparar.** Las bibliotecas usan logaritmo natural; para pasar a bits se divide entre 0.693.

## Conexiones

Promedia el [[contenido-de-informacion]] bajo un modelo y generaliza la [[entropia-de-shannon]], que es el caso $q = p$. Su exceso sobre la entropía es la [[divergencia-de-kullback-leibler]], y su exponencial es la [[perplejidad]] de un modelo de lenguaje. El [[teorema-de-codificacion-de-fuente]] la interpreta como la longitud promedio de un código diseñado para la distribución equivocada.

## Formulario

:::formula[Entropía cruzada]
$$
H(p, q) = -\sum_{x} p(x)\log_2 q(x)
$$

- $p$: distribución de los datos; $q$: distribución del modelo; $H(p, q)$: sorpresa promedio en bits.
:::

:::formula[Descomposición]
$$
H(p, q) = H(p) + D_{\mathrm{KL}}(p \,\|\, q)
$$

- $H(p)$: entropía de los datos; $D_{\mathrm{KL}}(p \,\|\, q)$: divergencia de Kullback-Leibler, no negativa.
:::

:::formula[Versión empírica]
$$
\hat{H} = -\frac{1}{n}\sum_{i=1}^{n} \log q(x_i)
$$

- $x_i$: observaciones; $n$: número de observaciones; $q(x_i)$: probabilidad que el modelo asigna a cada observación; $\hat{H}$: log-verosimilitud negativa promedio.
:::
