---
id: divergencia-de-kullback-leibler
titulo: Divergencia de Kullback-Leibler
titulo_en: Kullback-Leibler divergence
alias:
  - divergencia KL
  - entropía relativa
  - KL
  - D_KL
modulo: 0
submodulo: '0.8'
orden: 7
nivel: intermedio
prerrequisitos:
  - entropia-cruzada
etiquetas:
  - divergencia
  - entropía relativa
  - comparación de distribuciones
  - teoría de la información
resumen: >
  La divergencia KL(p || q) mide cuántos bits de más, en promedio, cuesta describir datos de p con un
  modelo q. Es no negativa, vale cero solo si p = q y no es simétrica.
formula: 'D_{\mathrm{KL}}(p \,\|\, q) = \sum_{x} p(x) \log_2 \frac{p(x)}{q(x)} = H(p, q) - H(p)'
visualizacion:
  componente: InformationViz
  parametros:
    modo: divergencia
    p: [0.7, 0.2, 0.1]
    q: [0.4, 0.4, 0.2]
    enfoque: kl
    etiquetas: [bajo, medio, alto]
referencias:
  - clave: cover-thomas
    capitulo: '2'
  - clave: bishop
    capitulo: '1.6'
publicado: true
---

## Intuición

Un código diseñado para una distribución equivocada desperdicia bits. Si un sistema de compresión supone que los tres niveles de consumo eléctrico de un hogar son casi igual de frecuentes, cuando en realidad el nivel bajo aparece 70 % de las veces, asignará al nivel bajo una palabra más larga de lo que merece. La divergencia de Kullback-Leibler cuenta ese desperdicio: los bits adicionales por símbolo que cuesta usar el modelo $q$ en lugar de la distribución verdadera $p$.

También se lee como una sorpresa adicional promedio. Cada observación $x$ sorprende al modelo $-\log_2 q(x)$ y sorprendería a la verdad $-\log_2 p(x)$; la diferencia, $\log_2 \frac{p(x)}{q(x)}$, promediada con los pesos de $p$, es la divergencia. Algunos términos son negativos, donde el modelo exagera la probabilidad, pero el promedio nunca lo es.

No es una distancia: cambiar el orden de $p$ y $q$ cambia el resultado, porque la pregunta cambia de quién genera los datos.

## Definición

:::definicion[Divergencia de Kullback-Leibler]
Sean $p$ y $q$ funciones de masa sobre $\mathcal{X}$, con $q(x) > 0$ siempre que $p(x) > 0$. La divergencia de $q$ respecto de $p$ es
$$
D_{\mathrm{KL}}(p \,\|\, q) = \sum_{x \in \mathcal{X}} p(x) \log_2 \frac{p(x)}{q(x)} = \mathbb{E}_{X \sim p}\left[\log_2 \frac{p(X)}{q(X)}\right],
$$
con la convención $0 \log \frac{0}{q} = 0$. Si existe $x$ con $p(x) > 0$ y $q(x) = 0$, la divergencia es infinita. Para densidades se reemplaza la suma por una integral.
:::

Se cumple $D_{\mathrm{KL}}(p \,\|\, q) = H(p, q) - H(p)$.

:::nota[Qué significa cada símbolo]
- $p$: distribución de referencia, la que genera los datos.
- $q$: distribución que se compara, el modelo.
- $\mathcal{X}$: conjunto de valores.
- $D_{\mathrm{KL}}(p \,\|\, q)$: divergencia en bits con logaritmo base 2.
- $\mathbb{E}_{X \sim p}$: esperanza bajo $p$.
- $H(p, q)$: entropía cruzada; $H(p)$: entropía de $p$.
:::

## Cómo usar la visualización

Para cada nivel se dibuja la barra de $p$ y la de $q$, y encima el término $p(x)\log_2 \frac{p(x)}{q(x)}$ de la divergencia. El encabezado suma esos términos. La reproducción mueve $q$ hacia $p$ en veinte pasos; las lecturas incluyen la divergencia en el otro sentido, $D_{\mathrm{KL}}(q \,\|\, p)$.

Al inicio los términos son $0.565$, $-0.2$ y $-0.1$: dos son negativos porque el modelo exagera los niveles medio y alto, pero la suma es $0.265$ bits, positiva. La divergencia inversa vale $0.277$, distinta. Al avanzar, todos los términos se acercan a cero y la divergencia también.

## Ejemplo

Un casino sospecha que un dado está cargado: el modelo $q$ da probabilidad 0.5 al seis y 0.1 a cada otra cara. Si el dado es en realidad justo ($p$ uniforme), ¿cuánto se pierde por usar el modelo?

1. Para las caras 1 a 5: $\frac{1}{6}\log_2 \frac{1/6}{0.1} = \frac{1}{6} \cdot 0.737 = 0.123$ cada una, en total $0.614$.
2. Para el seis: $\frac{1}{6}\log_2 \frac{1/6}{0.5} = \frac{1}{6} \cdot (-1.585) = -0.264$.
3. Suma: $D_{\mathrm{KL}}(p \,\|\, q) = 0.614 - 0.264 = 0.350$ bits por tirada.
4. En el otro sentido, si el dado estuviera cargado y se usara el modelo justo, $D_{\mathrm{KL}}(q \,\|\, p) = 0.424$ bits.

:::figura[Dado justo contra modelo cargado al seis: los cinco términos de 0.123 y el término negativo de $-0.264$ suman 0.350 bits; la divergencia inversa marca 0.424.]{componente="InformationViz"}
```yaml
modo: divergencia
p: [1, 1, 1, 1, 1, 1]
q: [0.1, 0.1, 0.1, 0.1, 0.1, 0.5]
enfoque: kl
etiquetas: ['1', '2', '3', '4', '5', '6']
```
:::

## Propiedades

- **Desigualdad de Gibbs:** $D_{\mathrm{KL}}(p \,\|\, q) \ge 0$, con igualdad si y solo si $p = q$. Se demuestra con la desigualdad de Jensen aplicada al logaritmo, que es cóncavo.

:::demostracion
Por concavidad del logaritmo, $-D_{\mathrm{KL}}(p \,\|\, q) = \sum_x p(x) \log \frac{q(x)}{p(x)} \le \log \sum_x p(x) \frac{q(x)}{p(x)} = \log \sum_{x : p(x) > 0} q(x) \le \log 1 = 0$. La igualdad exige que $q(x)/p(x)$ sea constante, es decir, $q = p$.
:::

- **Asimetría:** en general $D_{\mathrm{KL}}(p \,\|\, q) \ne D_{\mathrm{KL}}(q \,\|\, p)$, y no cumple la desigualdad del triángulo; no es una métrica.

:::figura[Moneda justa contra un modelo con 0.9 de cara: la divergencia es 0.737 bits en este sentido y 0.531 en el inverso; las dos llegan a cero cuando el modelo alcanza a la moneda.]{componente="InformationViz"}
```yaml
modo: divergencia
p: [0.5, 0.5]
q: [0.9, 0.1]
enfoque: kl
etiquetas: [cara, cruz]
```
:::

- **Aditividad:** para pares de variables independientes bajo $p$ y bajo $q$, la divergencia de las conjuntas es la suma de las divergencias de las marginales.
- **Convexidad:** $D_{\mathrm{KL}}(p \,\|\, q)$ es convexa en el par $(p, q)$.
- **Información mutua:** $I(X; Y) = D_{\mathrm{KL}}\big(p(x, y) \,\|\, p(x)\,p(y)\big)$.

## Errores comunes

- **Tratarla como una distancia.** No es simétrica y no cumple el triángulo; decir que $q$ está "a 0.3 bits" de $p$ sin indicar el sentido es ambiguo.
- **Pensar que cada término es no negativo.** Los términos donde $q(x) > p(x)$ son negativos; solo la suma es no negativa.
- **Ignorar el soporte.** Si $q$ da probabilidad cero a un valor posible bajo $p$, la divergencia es infinita, por pequeño que sea $p(x)$.
- **Confundir el papel de los argumentos al estimar.** Minimizar $D_{\mathrm{KL}}(p \,\|\, q)$ en el modelo $q$ (máxima verosimilitud) produce ajustes distintos que minimizar $D_{\mathrm{KL}}(q \,\|\, p)$ (inferencia variacional); la diferencia se estudia en la [[asimetria-de-la-divergencia-kl]].

## Conexiones

Es el exceso de la [[entropia-cruzada]] sobre la [[entropia-de-shannon]]. La [[informacion-mutua]] es un caso particular. La [[divergencia-de-jensen-shannon]] la simetriza, las [[divergencias-f]] la generalizan con otras funciones convexas, como las de [[funciones-convexas-y-concavas]], y la [[distancia-de-wasserstein-y-transporte-optimo]] es una alternativa que sí toma en cuenta la geometría de los valores.

## Formulario

:::formula[Divergencia KL]
$$
D_{\mathrm{KL}}(p \,\|\, q) = \sum_{x} p(x)\log_2 \frac{p(x)}{q(x)}
$$

- $p$: distribución de referencia; $q$: distribución comparada; $p(x)$, $q(x)$: sus probabilidades en $x$.
:::

:::formula[Relación con la entropía cruzada]
$$
D_{\mathrm{KL}}(p \,\|\, q) = H(p, q) - H(p)
$$

- $H(p, q)$: entropía cruzada; $H(p)$: entropía de $p$.
:::

:::formula[Desigualdad de Gibbs]
$$
D_{\mathrm{KL}}(p \,\|\, q) \ge 0, \qquad D_{\mathrm{KL}}(p \,\|\, q) = 0 \iff p = q
$$

- La divergencia solo se anula cuando las dos distribuciones coinciden.
:::
